import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import (
    Category,
    Course,
    CourseLevel,
    Enrollment,
    LessonProgress,
    Module,
    Section,
    Lesson,
    User,
    course_prerequisites,
    department_courses,
)
from app.schemas import (
    CategoryCreate,
    CategoryOut,
    CourseCreate,
    CourseOut,
    CourseUpdate,
    EnrollmentOut,
    ModuleCreate,
    ModuleOut,
    SectionCreate,
    SectionOut,
    LessonCreate,
    LessonOut,
)

router = APIRouter(tags=["courses"])


def _slugify(text: str) -> str:
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    return slug[:350]


# ── Categories ──────────────────────────────────────────────────────
@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.name))
    return result.scalars().all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
async def create_category(
    body: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    cat = Category(name=body.name, icon=body.icon, color=body.color)
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat


# ── Courses CRUD ────────────────────────────────────────────────────
@router.get("/courses", response_model=list[CourseOut])
async def list_courses(
    search: str = "",
    category_id: int | None = None,
    level: CourseLevel | None = None,
    department_id: int | None = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = select(Course).options(
        selectinload(Course.category),
        selectinload(Course.modules),
        selectinload(Course.enrollments),
        selectinload(Course.reviews),
    )
    if user.role != "admin":
        q = q.where(Course.is_published.is_(True))
    if search:
        escaped = search.replace("%", "\\%").replace("_", "\\_")
        q = q.where(Course.title.ilike(f"%{escaped}%", escape="\\"))
    if category_id:
        q = q.where(Course.category_id == category_id)
    if level:
        q = q.where(Course.level == level)
    if department_id:
        q = q.join(department_courses).where(department_courses.c.department_id == department_id)

    q = q.order_by(Course.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(q)
    courses = result.scalars().unique().all()
    out = []
    for c in courses:
        ratings = [r.rating for r in c.reviews]
        out.append(CourseOut(
            id=c.id, title=c.title, slug=c.slug, description=c.description,
            thumbnail_url=c.thumbnail_url, level=c.level,
            is_published=c.is_published, is_sequential=c.is_sequential,
            duration_minutes=c.duration_minutes, deadline=c.deadline,
            access_days=c.access_days, category_id=c.category_id,
            category_name=c.category.name if c.category else None,
            created_at=c.created_at, updated_at=c.updated_at,
            enrollment_count=len(c.enrollments),
            avg_rating=round(sum(ratings) / len(ratings), 1) if ratings else 0.0,
            module_count=len(c.modules),
        ))
    return out


@router.get("/courses/{course_id}", response_model=CourseOut)
async def get_course(course_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Course).options(
            selectinload(Course.category),
            selectinload(Course.modules).selectinload(Module.sections).selectinload(Section.lessons),
            selectinload(Course.enrollments),
            selectinload(Course.reviews),
        ).where(Course.id == course_id)
    )
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại")
    if not c.is_published and user.role != "admin":
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại")
    ratings = [r.rating for r in c.reviews]
    return CourseOut(
        id=c.id, title=c.title, slug=c.slug, description=c.description,
        thumbnail_url=c.thumbnail_url, level=c.level,
        is_published=c.is_published, is_sequential=c.is_sequential,
        duration_minutes=c.duration_minutes, deadline=c.deadline,
        access_days=c.access_days, category_id=c.category_id,
        category_name=c.category.name if c.category else None,
        created_at=c.created_at, updated_at=c.updated_at,
        enrollment_count=len(c.enrollments),
        avg_rating=round(sum(ratings) / len(ratings), 1) if ratings else 0.0,
        module_count=len(c.modules),
    )


@router.post("/courses", response_model=CourseOut, status_code=201)
async def create_course(
    body: CourseCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    slug = _slugify(body.title)
    existing = await db.execute(select(Course).where(Course.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{int(datetime.now(timezone.utc).timestamp())}"

    course = Course(
        title=body.title, slug=slug, description=body.description,
        thumbnail_url=body.thumbnail_url, level=body.level,
        is_sequential=body.is_sequential, duration_minutes=body.duration_minutes,
        deadline=body.deadline, access_days=body.access_days,
        category_id=body.category_id,
    )
    db.add(course)
    await db.flush()

    if body.prerequisite_ids:
        for pid in body.prerequisite_ids:
            await db.execute(
                course_prerequisites.insert().values(course_id=course.id, prerequisite_id=pid)
            )
    if body.department_ids:
        for did in body.department_ids:
            await db.execute(
                department_courses.insert().values(department_id=did, course_id=course.id)
            )

    await db.commit()
    await db.refresh(course)
    return CourseOut(
        id=course.id, title=course.title, slug=course.slug,
        description=course.description, thumbnail_url=course.thumbnail_url,
        level=course.level, is_published=course.is_published,
        is_sequential=course.is_sequential, duration_minutes=course.duration_minutes,
        deadline=course.deadline, access_days=course.access_days,
        category_id=course.category_id, category_name=None,
        created_at=course.created_at, updated_at=course.updated_at,
    )


@router.put("/courses/{course_id}", response_model=CourseOut)
async def update_course(
    course_id: int,
    body: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại")
    data = body.model_dump(exclude_unset=True, exclude={"prerequisite_ids", "department_ids"})
    for k, v in data.items():
        setattr(course, k, v)

    if body.prerequisite_ids is not None:
        await db.execute(
            course_prerequisites.delete().where(course_prerequisites.c.course_id == course.id)
        )
        for pid in body.prerequisite_ids:
            await db.execute(
                course_prerequisites.insert().values(course_id=course.id, prerequisite_id=pid)
            )
    if body.department_ids is not None:
        await db.execute(
            department_courses.delete().where(department_courses.c.course_id == course.id)
        )
        for did in body.department_ids:
            await db.execute(
                department_courses.insert().values(department_id=did, course_id=course.id)
            )

    await db.commit()
    result2 = await db.execute(
        select(Course).options(
            selectinload(Course.category),
            selectinload(Course.modules),
            selectinload(Course.enrollments),
            selectinload(Course.reviews),
        ).where(Course.id == course_id)
    )
    course = result2.scalar_one()
    ratings = [r.rating for r in course.reviews]
    return CourseOut(
        id=course.id, title=course.title, slug=course.slug,
        description=course.description, thumbnail_url=course.thumbnail_url,
        level=course.level, is_published=course.is_published,
        is_sequential=course.is_sequential, duration_minutes=course.duration_minutes,
        deadline=course.deadline, access_days=course.access_days,
        category_id=course.category_id,
        category_name=course.category.name if course.category else None,
        created_at=course.created_at, updated_at=course.updated_at,
        enrollment_count=len(course.enrollments),
        avg_rating=round(sum(ratings) / len(ratings), 1) if ratings else 0.0,
        module_count=len(course.modules),
    )


@router.delete("/courses/{course_id}", status_code=204)
async def delete_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại")
    await db.delete(course)
    await db.commit()


# ── Enrollment ──────────────────────────────────────────────────────
@router.post("/courses/{course_id}/enroll", status_code=201)
async def enroll(course_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    course = (await db.execute(select(Course).where(Course.id == course_id))).scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại")
    if not course.is_published:
        raise HTTPException(status_code=400, detail="Khóa học chưa được xuất bản")
    existing = await db.execute(
        select(Enrollment).where(Enrollment.user_id == user.id, Enrollment.course_id == course_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Bạn đã đăng ký khóa học này")
    enrollment = Enrollment(user_id=user.id, course_id=course_id)
    db.add(enrollment)
    await db.commit()
    return {"message": "Đăng ký thành công"}


@router.get("/enrollments/me", response_model=list[EnrollmentOut])
async def my_enrollments(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Enrollment).options(selectinload(Enrollment.course))
        .where(Enrollment.user_id == user.id)
        .order_by(Enrollment.enrolled_at.desc())
    )
    enrollments = result.scalars().all()
    out = []
    for e in enrollments:
        total_q = await db.execute(
            select(func.count(Lesson.id))
            .join(Section, Lesson.section_id == Section.id)
            .join(Module, Section.module_id == Module.id)
            .where(Module.course_id == e.course_id)
        )
        total_lessons = total_q.scalar() or 0

        completed_q = await db.execute(
            select(func.count(LessonProgress.id))
            .join(Lesson, LessonProgress.lesson_id == Lesson.id)
            .join(Section, Lesson.section_id == Section.id)
            .join(Module, Section.module_id == Module.id)
            .where(Module.course_id == e.course_id, LessonProgress.user_id == user.id, LessonProgress.completed.is_(True))
        )
        completed_lessons = completed_q.scalar() or 0

        progress = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        out.append(EnrollmentOut(
            id=e.id, user_id=e.user_id, course_id=e.course_id,
            enrolled_at=e.enrolled_at, completed_at=e.completed_at,
            course_title=e.course.title, course_thumbnail=e.course.thumbnail_url,
            progress_percent=round(progress, 1),
        ))
    return out


# ── Modules ─────────────────────────────────────────────────────────
@router.get("/courses/{course_id}/modules", response_model=list[ModuleOut])
async def list_modules(course_id: int, db: AsyncSession = Depends(get_db), _user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Module).options(
            selectinload(Module.sections).selectinload(Section.lessons)
        ).where(Module.course_id == course_id).order_by(Module.order)
    )
    return result.scalars().all()


@router.post("/courses/{course_id}/modules", response_model=ModuleOut, status_code=201)
async def create_module(
    course_id: int, body: ModuleCreate,
    db: AsyncSession = Depends(get_db), _admin: User = Depends(require_admin),
):
    mod = Module(title=body.title, order=body.order, course_id=course_id)
    db.add(mod)
    await db.commit()
    await db.refresh(mod)
    return mod


# ── Sections ────────────────────────────────────────────────────────
@router.post("/modules/{module_id}/sections", response_model=SectionOut, status_code=201)
async def create_section(
    module_id: int, body: SectionCreate,
    db: AsyncSession = Depends(get_db), _admin: User = Depends(require_admin),
):
    sec = Section(title=body.title, order=body.order, module_id=module_id)
    db.add(sec)
    await db.commit()
    await db.refresh(sec)
    return sec


# ── Lessons ─────────────────────────────────────────────────────────
@router.post("/sections/{section_id}/lessons", response_model=LessonOut, status_code=201)
async def create_lesson(
    section_id: int, body: LessonCreate,
    db: AsyncSession = Depends(get_db), _admin: User = Depends(require_admin),
):
    lesson = Lesson(
        title=body.title, lesson_type=body.lesson_type, content=body.content,
        video_url=body.video_url, duration_minutes=body.duration_minutes,
        order=body.order, section_id=section_id,
        attachment_url=body.attachment_url, attachment_name=body.attachment_name,
    )
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson


@router.post("/lessons/{lesson_id}/complete")
async def mark_lesson_complete(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson_result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    if not lesson_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Bài học không tồn tại")
    existing = await db.execute(
        select(LessonProgress).where(
            LessonProgress.user_id == user.id, LessonProgress.lesson_id == lesson_id
        )
    )
    progress = existing.scalar_one_or_none()
    if progress:
        if not progress.completed:
            progress.completed = True
            progress.completed_at = datetime.now(timezone.utc)
            user.points += 10
    else:
        progress = LessonProgress(
            user_id=user.id, lesson_id=lesson_id,
            completed=True, completed_at=datetime.now(timezone.utc),
        )
        db.add(progress)
        user.points += 10
    await db.commit()
    return {"message": "Đã đánh dấu hoàn thành", "points": user.points}
