from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import Badge, UserBadge, User
from app.schemas import BadgeOut

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/badges", response_model=list[BadgeOut])
async def list_badges(
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(select(Badge).order_by(Badge.name))
    return [
        BadgeOut(
            id=b.id, name=b.name, description=b.description,
            icon=b.icon, badge_type=b.badge_type,
            points_value=b.points_value,
        )
        for b in result.scalars().all()
    ]


@router.get("/my-badges", response_model=list[BadgeOut])
async def my_badges(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(UserBadge).options(selectinload(UserBadge.badge))
        .where(UserBadge.user_id == user.id)
        .order_by(UserBadge.earned_at.desc())
    )
    user_badges = result.scalars().all()
    return [
        BadgeOut(
            id=ub.badge.id, name=ub.badge.name, description=ub.badge.description,
            icon=ub.badge.icon, badge_type=ub.badge.badge_type,
            points_value=ub.badge.points_value, earned_at=ub.earned_at,
        )
        for ub in user_badges
    ]


@router.post("/award-badge/{user_id}/{badge_id}", status_code=201)
async def award_badge(
    user_id: int,
    badge_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    existing = await db.execute(
        select(UserBadge).where(UserBadge.user_id == user_id, UserBadge.badge_id == badge_id)
    )
    if existing.scalar_one_or_none():
        return {"message": "Đã có badge này"}

    badge_result = await db.execute(select(Badge).where(Badge.id == badge_id))
    badge = badge_result.scalar_one_or_none()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge không tồn tại")

    user_result = await db.execute(select(User).where(User.id == user_id))
    target_user = user_result.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")

    ub = UserBadge(user_id=user_id, badge_id=badge_id)
    db.add(ub)
    target_user.points += badge.points_value

    await db.commit()
    return {"message": "Đã trao badge"}
