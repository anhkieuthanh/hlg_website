from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user
from app.models import Review, User
from app.schemas import ReviewCreate, ReviewOut

router = APIRouter(prefix="/courses/{course_id}/reviews", tags=["reviews"])


@router.get("", response_model=list[ReviewOut])
async def list_reviews(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Review).options(selectinload(Review.user))
        .where(Review.course_id == course_id)
        .order_by(Review.created_at.desc())
    )
    reviews = result.scalars().all()
    return [
        ReviewOut(
            id=r.id, user_id=r.user_id, user_name=r.user.full_name,
            course_id=r.course_id, rating=r.rating, comment=r.comment,
            created_at=r.created_at,
        )
        for r in reviews
    ]


@router.post("", response_model=ReviewOut, status_code=201)
async def create_review(
    course_id: int,
    body: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if body.rating < 1 or body.rating > 5:
        raise HTTPException(status_code=400, detail="Rating phải từ 1 đến 5")

    existing = await db.execute(
        select(Review).where(Review.user_id == user.id, Review.course_id == course_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Bạn đã đánh giá khóa học này")

    review = Review(
        user_id=user.id, course_id=course_id,
        rating=body.rating, comment=body.comment,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return ReviewOut(
        id=review.id, user_id=review.user_id, user_name=user.full_name,
        course_id=review.course_id, rating=review.rating,
        comment=review.comment, created_at=review.created_at,
    )
