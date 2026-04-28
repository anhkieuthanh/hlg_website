from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import Assignment, Submission, SubmissionStatus, User
from app.schemas import (
    AssignmentCreate,
    AssignmentOut,
    SubmissionCreate,
    SubmissionOut,
)

router = APIRouter(tags=["assignments"])


@router.get("/lessons/{lesson_id}/assignments", response_model=list[AssignmentOut])
async def list_assignments(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Assignment).where(Assignment.lesson_id == lesson_id)
    )
    return result.scalars().all()


@router.post("/lessons/{lesson_id}/assignments", response_model=AssignmentOut, status_code=201)
async def create_assignment(
    lesson_id: int,
    body: AssignmentCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    assignment = Assignment(
        title=body.title, description=body.description, lesson_id=lesson_id,
        max_score=body.max_score, allow_file_upload=body.allow_file_upload,
        allow_link=body.allow_link, auto_grade=body.auto_grade,
        deadline=body.deadline,
    )
    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)
    return assignment


@router.post("/assignments/{assignment_id}/submit", response_model=SubmissionOut, status_code=201)
async def submit_assignment(
    assignment_id: int,
    body: SubmissionCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(Assignment).where(Assignment.id == assignment_id))
    assignment = result.scalar_one_or_none()
    if not assignment:
        raise HTTPException(status_code=404, detail="Bài tập không tồn tại")

    status = SubmissionStatus.PENDING
    score = None
    if assignment.auto_grade:
        status = SubmissionStatus.AUTO_GRADED
        score = assignment.max_score

    submission = Submission(
        user_id=user.id, assignment_id=assignment_id,
        link_url=body.link_url, text_content=body.text_content,
        status=status, score=score,
    )
    db.add(submission)

    if score is not None:
        user.points += 30

    await db.commit()
    await db.refresh(submission)
    return submission


@router.get("/assignments/{assignment_id}/submissions", response_model=list[SubmissionOut])
async def list_submissions(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(Submission).where(Submission.assignment_id == assignment_id)
        .order_by(Submission.submitted_at.desc())
    )
    return result.scalars().all()


@router.put("/submissions/{submission_id}/grade", response_model=SubmissionOut)
async def grade_submission(
    submission_id: int,
    score: float,
    feedback: str = "",
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(Submission).where(Submission.id == submission_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Bài nộp không tồn tại")
    sub.score = score
    sub.feedback = feedback
    sub.status = SubmissionStatus.GRADED
    await db.commit()
    await db.refresh(sub)
    return sub
