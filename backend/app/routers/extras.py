from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import (
    Bookmark, CalendarEvent, FAQItem, Note,
    QAAnswer, QAQuestion, User, user_wishlist, Course,
)
from app.schemas import (
    BookmarkOut, CalendarEventCreate, CalendarEventOut,
    FAQCreate, FAQOut, NoteCreate, NoteOut,
    QAAnswerCreate, QAAnswerOut, QAQuestionCreate, QAQuestionOut,
)

router = APIRouter(tags=["extras"])


# ── Bookmarks ───────────────────────────────────────────────────────
@router.post("/lessons/{lesson_id}/bookmark", status_code=201)
async def toggle_bookmark(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    existing = await db.execute(
        select(Bookmark).where(Bookmark.user_id == user.id, Bookmark.lesson_id == lesson_id)
    )
    bm = existing.scalar_one_or_none()
    if bm:
        await db.delete(bm)
        await db.commit()
        return {"bookmarked": False}
    bm = Bookmark(user_id=user.id, lesson_id=lesson_id)
    db.add(bm)
    await db.commit()
    return {"bookmarked": True}


@router.get("/bookmarks/me", response_model=list[BookmarkOut])
async def my_bookmarks(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Bookmark).options(selectinload(Bookmark.lesson))
        .where(Bookmark.user_id == user.id)
        .order_by(Bookmark.created_at.desc())
    )
    bookmarks = result.scalars().all()
    return [
        BookmarkOut(
            id=b.id, lesson_id=b.lesson_id,
            lesson_title=b.lesson.title if b.lesson else "",
            created_at=b.created_at,
        )
        for b in bookmarks
    ]


# ── Notes ───────────────────────────────────────────────────────────
@router.get("/lessons/{lesson_id}/notes", response_model=list[NoteOut])
async def list_notes(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Note).where(Note.user_id == user.id, Note.lesson_id == lesson_id)
        .order_by(Note.created_at.desc())
    )
    return result.scalars().all()


@router.post("/lessons/{lesson_id}/notes", response_model=NoteOut, status_code=201)
async def create_note(
    lesson_id: int,
    body: NoteCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    note = Note(
        user_id=user.id, lesson_id=lesson_id,
        content=body.content, timestamp_seconds=body.timestamp_seconds,
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note


@router.delete("/notes/{note_id}", status_code=204)
async def delete_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Ghi chú không tồn tại")
    await db.delete(note)
    await db.commit()


# ── Wishlist ────────────────────────────────────────────────────────
@router.post("/courses/{course_id}/wishlist", status_code=201)
async def toggle_wishlist(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    existing = await db.execute(
        select(user_wishlist).where(
            user_wishlist.c.user_id == user.id,
            user_wishlist.c.course_id == course_id,
        )
    )
    if existing.first():
        await db.execute(
            user_wishlist.delete().where(
                user_wishlist.c.user_id == user.id,
                user_wishlist.c.course_id == course_id,
            )
        )
        await db.commit()
        return {"wishlisted": False}
    await db.execute(user_wishlist.insert().values(user_id=user.id, course_id=course_id))
    await db.commit()
    return {"wishlisted": True}


@router.get("/wishlist/me")
async def my_wishlist(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Course).join(user_wishlist).where(user_wishlist.c.user_id == user.id)
    )
    courses = result.scalars().all()
    return [{"id": c.id, "title": c.title, "thumbnail_url": c.thumbnail_url, "level": c.level.value} for c in courses]


# ── FAQ ─────────────────────────────────────────────────────────────
@router.get("/faq", response_model=list[FAQOut])
async def list_faq(
    course_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(FAQItem)
    if course_id:
        q = q.where((FAQItem.course_id == course_id) | (FAQItem.is_global.is_(True)))
    else:
        q = q.where(FAQItem.is_global.is_(True))
    q = q.order_by(FAQItem.order)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/faq", response_model=FAQOut, status_code=201)
async def create_faq(
    body: FAQCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    item = FAQItem(
        question=body.question, answer=body.answer, order=body.order,
        course_id=body.course_id, is_global=body.is_global,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


# ── Q&A ─────────────────────────────────────────────────────────────
@router.get("/courses/{course_id}/qa", response_model=list[QAQuestionOut])
async def list_qa(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(QAQuestion)
        .options(selectinload(QAQuestion.user), selectinload(QAQuestion.answers).selectinload(QAAnswer.user))
        .where(QAQuestion.course_id == course_id)
        .order_by(QAQuestion.created_at.desc())
    )
    questions = result.scalars().all()
    return [
        QAQuestionOut(
            id=q.id, user_id=q.user_id, user_name=q.user.full_name,
            course_id=q.course_id, title=q.title, body=q.body,
            is_resolved=q.is_resolved, created_at=q.created_at,
            answers=[
                QAAnswerOut(
                    id=a.id, user_id=a.user_id, user_name=a.user.full_name,
                    body=a.body, is_accepted=a.is_accepted, created_at=a.created_at,
                )
                for a in q.answers
            ],
        )
        for q in questions
    ]


@router.post("/courses/{course_id}/qa", response_model=QAQuestionOut, status_code=201)
async def create_qa_question(
    course_id: int,
    body: QAQuestionCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = QAQuestion(user_id=user.id, course_id=course_id, title=body.title, body=body.body)
    db.add(q)
    await db.commit()
    await db.refresh(q)
    return QAQuestionOut(
        id=q.id, user_id=q.user_id, user_name=user.full_name,
        course_id=q.course_id, title=q.title, body=q.body,
        is_resolved=q.is_resolved, created_at=q.created_at,
    )


@router.post("/qa/{question_id}/answers", response_model=QAAnswerOut, status_code=201)
async def create_qa_answer(
    question_id: int,
    body: QAAnswerCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    a = QAAnswer(user_id=user.id, question_id=question_id, body=body.body)
    db.add(a)
    await db.commit()
    await db.refresh(a)
    return QAAnswerOut(
        id=a.id, user_id=a.user_id, user_name=user.full_name,
        body=a.body, is_accepted=a.is_accepted, created_at=a.created_at,
    )


# ── Calendar ────────────────────────────────────────────────────────
@router.get("/calendar", response_model=list[CalendarEventOut])
async def list_events(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(CalendarEvent).where(
            (CalendarEvent.user_id == user.id) | (CalendarEvent.is_global.is_(True))
        ).order_by(CalendarEvent.event_date)
    )
    return result.scalars().all()


@router.post("/calendar", response_model=CalendarEventOut, status_code=201)
async def create_event(
    body: CalendarEventCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    event = CalendarEvent(
        title=body.title, description=body.description,
        event_date=body.event_date, course_id=body.course_id,
        user_id=user.id, is_global=body.is_global if user.role.value == "admin" else False,
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event
