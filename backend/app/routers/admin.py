from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import require_admin
from app.models import Enrollment, User
from app.schemas import AdminStats

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
async def admin_stats(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0

    from app.models import Course
    total_courses = (await db.execute(select(func.count(Course.id)))).scalar() or 0
    total_enrollments = (await db.execute(select(func.count(Enrollment.id)))).scalar() or 0
    total_completions = (
        await db.execute(
            select(func.count(Enrollment.id)).where(Enrollment.completed_at.isnot(None))
        )
    ).scalar() or 0

    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    active_users_30d = (
        await db.execute(
            select(func.count(func.distinct(Enrollment.user_id))).where(
                Enrollment.enrolled_at >= cutoff
            )
        )
    ).scalar() or 0

    return AdminStats(
        total_users=total_users,
        total_courses=total_courses,
        total_enrollments=total_enrollments,
        total_completions=total_completions,
        active_users_30d=active_users_30d,
    )
