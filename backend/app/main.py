from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import admin, assignments, auth, courses, departments, extras, gamification, quizzes, reviews, users
from app.seed import seed_data
from app.database import async_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as db:
        await seed_data(db)
    yield


app = FastAPI(
    title="Hoàng Long Group Academy",
    description="Nền tảng đào tạo nội bộ doanh nghiệp",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(departments.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(quizzes.router, prefix="/api")
app.include_router(assignments.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(gamification.router, prefix="/api")
app.include_router(extras.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "Hoàng Long Group Academy"}
