import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import Quiz, QuizAttempt, QuizQuestion, User
from app.schemas import (
    QuizAttemptOut,
    QuizCreate,
    QuizOut,
    QuizQuestionOut,
    QuizSubmitRequest,
)

router = APIRouter(prefix="/lessons/{lesson_id}/quizzes", tags=["quizzes"])


@router.get("", response_model=list[QuizOut])
async def list_quizzes(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Quiz)
        .options(selectinload(Quiz.questions))
        .where(Quiz.lesson_id == lesson_id)
    )
    quizzes = result.scalars().all()
    out = []
    for q in quizzes:
        questions = [
            QuizQuestionOut(
                id=qq.id,
                question_text=qq.question_text,
                quiz_type=qq.quiz_type,
                options=qq.options,
                points=qq.points,
                order=qq.order,
            )
            for qq in sorted(q.questions, key=lambda x: x.order)
        ]
        out.append(QuizOut(
            id=q.id, title=q.title, lesson_id=q.lesson_id,
            passing_score=q.passing_score, questions=questions,
        ))
    return out


@router.post("", response_model=QuizOut, status_code=201)
async def create_quiz(
    lesson_id: int,
    body: QuizCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    quiz = Quiz(title=body.title, lesson_id=lesson_id, passing_score=body.passing_score)
    db.add(quiz)
    await db.flush()
    for qq in body.questions:
        question = QuizQuestion(
            quiz_id=quiz.id,
            question_text=qq.question_text,
            quiz_type=qq.quiz_type,
            options=qq.options,
            correct_answer=qq.correct_answer,
            points=qq.points,
            order=qq.order,
        )
        db.add(question)
    await db.commit()
    await db.refresh(quiz)
    result = await db.execute(
        select(Quiz).options(selectinload(Quiz.questions)).where(Quiz.id == quiz.id)
    )
    quiz = result.scalar_one()
    questions = [
        QuizQuestionOut(
            id=qq.id, question_text=qq.question_text, quiz_type=qq.quiz_type,
            options=qq.options, points=qq.points, order=qq.order,
        )
        for qq in sorted(quiz.questions, key=lambda x: x.order)
    ]
    return QuizOut(
        id=quiz.id, title=quiz.title, lesson_id=quiz.lesson_id,
        passing_score=quiz.passing_score, questions=questions,
    )


@router.post("/{quiz_id}/submit", response_model=QuizAttemptOut)
async def submit_quiz(
    lesson_id: int,
    quiz_id: int,
    body: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Quiz).options(selectinload(Quiz.questions)).where(Quiz.id == quiz_id)
    )
    quiz = result.scalar_one_or_none()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz không tồn tại")

    questions = sorted(quiz.questions, key=lambda x: x.order)
    if len(body.answers) != len(questions):
        raise HTTPException(status_code=400, detail="Số câu trả lời không khớp")

    total_points = 0
    earned_points = 0
    for q, answer in zip(questions, body.answers):
        total_points += q.points
        if answer.strip().lower() == q.correct_answer.strip().lower():
            earned_points += q.points

    score = (earned_points / total_points * 100) if total_points > 0 else 0
    passed = score >= quiz.passing_score

    attempt = QuizAttempt(
        user_id=user.id,
        quiz_id=quiz_id,
        score=round(score, 1),
        answers=json.dumps(body.answers),
        passed=passed,
    )
    db.add(attempt)

    if passed:
        prior_pass = await db.execute(
            select(QuizAttempt).where(
                QuizAttempt.user_id == user.id,
                QuizAttempt.quiz_id == quiz_id,
                QuizAttempt.passed.is_(True),
            )
        )
        if not prior_pass.scalar_one_or_none():
            user.points += 50

    await db.commit()
    await db.refresh(attempt)
    return QuizAttemptOut(
        id=attempt.id, quiz_id=attempt.quiz_id,
        score=attempt.score, passed=attempt.passed,
        attempted_at=attempt.attempted_at,
    )


@router.get("/{quiz_id}/attempts", response_model=list[QuizAttemptOut])
async def my_attempts(
    lesson_id: int,
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(QuizAttempt)
        .where(QuizAttempt.user_id == user.id, QuizAttempt.quiz_id == quiz_id)
        .order_by(QuizAttempt.attempted_at.desc())
    )
    return result.scalars().all()
