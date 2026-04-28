from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import User, Role
from app.schemas import UserOut, UserUpdate, LeaderboardEntry

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
async def get_profile(user: User = Depends(get_current_user)):
    dept_name = user.department.name if user.department else None
    return UserOut(
        id=user.id, email=user.email, full_name=user.full_name,
        avatar_url=user.avatar_url, bio=user.bio, phone=user.phone,
        position=user.position, role=user.role, is_active=user.is_active,
        department_id=user.department_id, department_name=dept_name,
        points=user.points, created_at=user.created_at,
    )


@router.put("/me", response_model=UserOut)
async def update_profile(
    body: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(user, field, val)
    await db.commit()
    await db.refresh(user, attribute_names=["department"])
    dept_name = user.department.name if user.department else None
    return UserOut(
        id=user.id, email=user.email, full_name=user.full_name,
        avatar_url=user.avatar_url, bio=user.bio, phone=user.phone,
        position=user.position, role=user.role, is_active=user.is_active,
        department_id=user.department_id, department_name=dept_name,
        points=user.points, created_at=user.created_at,
    )


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
async def leaderboard(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(User)
        .options(selectinload(User.department), selectinload(User.badges))
        .where(User.is_active.is_(True))
        .order_by(User.points.desc())
        .limit(limit)
    )
    users = result.scalars().all()
    entries = []
    for rank, u in enumerate(users, 1):
        entries.append(LeaderboardEntry(
            user_id=u.id,
            full_name=u.full_name,
            avatar_url=u.avatar_url,
            department_name=u.department.name if u.department else None,
            points=u.points,
            badges_count=len(u.badges),
            rank=rank,
        ))
    return entries


@router.get("", response_model=list[UserOut])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(
        select(User).options(selectinload(User.department))
        .order_by(User.created_at.desc())
        .offset(skip).limit(limit)
    )
    users = result.scalars().all()
    return [
        UserOut(
            id=u.id, email=u.email, full_name=u.full_name,
            avatar_url=u.avatar_url, bio=u.bio, phone=u.phone,
            position=u.position, role=u.role, is_active=u.is_active,
            department_id=u.department_id,
            department_name=u.department.name if u.department else None,
            points=u.points, created_at=u.created_at,
        )
        for u in users
    ]


@router.put("/{user_id}/toggle-active")
async def toggle_active(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    user.is_active = not user.is_active
    await db.commit()
    return {"id": user.id, "is_active": user.is_active}


@router.put("/{user_id}/role")
async def change_role(
    user_id: int,
    role: Role,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    user.role = role
    await db.commit()
    return {"id": user.id, "role": user.role.value}
