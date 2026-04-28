from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models import (
    BadgeType,
    CourseLevel,
    LessonType,
    QuizType,
    Role,
    SubmissionStatus,
)


# ── Auth ────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str = ""
    position: str = ""
    department_id: int | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── User ────────────────────────────────────────────────────────────
class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    avatar_url: str
    bio: str
    phone: str
    position: str
    role: Role
    is_active: bool
    department_id: int | None
    department_name: str | None = None
    points: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    phone: str | None = None
    position: str | None = None
    department_id: int | None = None


# ── Department ──────────────────────────────────────────────────────
class DepartmentCreate(BaseModel):
    name: str
    description: str = ""


class DepartmentOut(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Category ────────────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    icon: str = "📚"
    color: str = "#1e40af"


class CategoryOut(BaseModel):
    id: int
    name: str
    icon: str
    color: str

    model_config = {"from_attributes": True}


# ── Course ──────────────────────────────────────────────────────────
class CourseCreate(BaseModel):
    title: str
    description: str = ""
    thumbnail_url: str = ""
    level: CourseLevel = CourseLevel.BEGINNER
    is_sequential: bool = True
    duration_minutes: int = 0
    deadline: datetime | None = None
    access_days: int | None = None
    category_id: int | None = None
    prerequisite_ids: list[int] = []
    department_ids: list[int] = []


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    thumbnail_url: str | None = None
    level: CourseLevel | None = None
    is_published: bool | None = None
    is_sequential: bool | None = None
    duration_minutes: int | None = None
    deadline: datetime | None = None
    access_days: int | None = None
    category_id: int | None = None
    prerequisite_ids: list[int] | None = None
    department_ids: list[int] | None = None


class CourseOut(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    thumbnail_url: str
    level: CourseLevel
    is_published: bool
    is_sequential: bool
    duration_minutes: int
    deadline: datetime | None
    access_days: int | None
    category_id: int | None
    category_name: str | None = None
    created_at: datetime
    updated_at: datetime
    enrollment_count: int = 0
    avg_rating: float = 0.0
    module_count: int = 0

    model_config = {"from_attributes": True}


# ── Module ──────────────────────────────────────────────────────────
class ModuleCreate(BaseModel):
    title: str
    order: int = 0


class ModuleOut(BaseModel):
    id: int
    title: str
    order: int
    course_id: int
    sections: list["SectionOut"] = []

    model_config = {"from_attributes": True}


# ── Section ─────────────────────────────────────────────────────────
class SectionCreate(BaseModel):
    title: str
    order: int = 0


class SectionOut(BaseModel):
    id: int
    title: str
    order: int
    module_id: int
    lessons: list["LessonOut"] = []

    model_config = {"from_attributes": True}


# ── Lesson ──────────────────────────────────────────────────────────
class LessonCreate(BaseModel):
    title: str
    lesson_type: LessonType = LessonType.VIDEO
    content: str = ""
    video_url: str = ""
    duration_minutes: int = 0
    order: int = 0
    attachment_url: str = ""
    attachment_name: str = ""


class LessonOut(BaseModel):
    id: int
    title: str
    lesson_type: LessonType
    content: str
    video_url: str
    duration_minutes: int
    order: int
    section_id: int
    attachment_url: str
    attachment_name: str
    completed: bool = False

    model_config = {"from_attributes": True}


# ── Quiz ────────────────────────────────────────────────────────────
class QuizQuestionCreate(BaseModel):
    question_text: str
    quiz_type: QuizType = QuizType.MULTIPLE_CHOICE
    options: str = "[]"
    correct_answer: str
    points: int = 10
    order: int = 0


class QuizQuestionOut(BaseModel):
    id: int
    question_text: str
    quiz_type: QuizType
    options: str
    points: int
    order: int

    model_config = {"from_attributes": True}


class QuizCreate(BaseModel):
    title: str
    passing_score: float = 70.0
    questions: list[QuizQuestionCreate] = []


class QuizOut(BaseModel):
    id: int
    title: str
    lesson_id: int
    passing_score: float
    questions: list[QuizQuestionOut] = []

    model_config = {"from_attributes": True}


class QuizSubmitRequest(BaseModel):
    answers: list[str]  # answer per question in order


class QuizAttemptOut(BaseModel):
    id: int
    quiz_id: int
    score: float
    passed: bool
    attempted_at: datetime

    model_config = {"from_attributes": True}


# ── Assignment ──────────────────────────────────────────────────────
class AssignmentCreate(BaseModel):
    title: str
    description: str = ""
    max_score: float = 100.0
    allow_file_upload: bool = True
    allow_link: bool = True
    auto_grade: bool = False
    deadline: datetime | None = None


class AssignmentOut(BaseModel):
    id: int
    title: str
    description: str
    lesson_id: int
    max_score: float
    allow_file_upload: bool
    allow_link: bool
    auto_grade: bool
    deadline: datetime | None

    model_config = {"from_attributes": True}


class SubmissionCreate(BaseModel):
    link_url: str = ""
    text_content: str = ""


class SubmissionOut(BaseModel):
    id: int
    user_id: int
    assignment_id: int
    file_url: str
    link_url: str
    text_content: str
    score: float | None
    status: SubmissionStatus
    feedback: str
    submitted_at: datetime

    model_config = {"from_attributes": True}


# ── Review ──────────────────────────────────────────────────────────
class ReviewCreate(BaseModel):
    rating: int  # 1-5
    comment: str = ""


class ReviewOut(BaseModel):
    id: int
    user_id: int
    user_name: str = ""
    course_id: int
    rating: int
    comment: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Bookmark / Note ─────────────────────────────────────────────────
class BookmarkOut(BaseModel):
    id: int
    lesson_id: int
    lesson_title: str = ""
    created_at: datetime

    model_config = {"from_attributes": True}


class NoteCreate(BaseModel):
    content: str
    timestamp_seconds: int | None = None


class NoteOut(BaseModel):
    id: int
    lesson_id: int
    content: str
    timestamp_seconds: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Badge ───────────────────────────────────────────────────────────
class BadgeOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    badge_type: BadgeType
    points_value: int
    earned_at: datetime | None = None

    model_config = {"from_attributes": True}


# ── FAQ ─────────────────────────────────────────────────────────────
class FAQCreate(BaseModel):
    question: str
    answer: str
    order: int = 0
    course_id: int | None = None
    is_global: bool = False


class FAQOut(BaseModel):
    id: int
    question: str
    answer: str
    order: int
    course_id: int | None
    is_global: bool

    model_config = {"from_attributes": True}


# ── Q&A ─────────────────────────────────────────────────────────────
class QAQuestionCreate(BaseModel):
    title: str
    body: str = ""


class QAAnswerCreate(BaseModel):
    body: str


class QAAnswerOut(BaseModel):
    id: int
    user_id: int
    user_name: str = ""
    body: str
    is_accepted: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class QAQuestionOut(BaseModel):
    id: int
    user_id: int
    user_name: str = ""
    course_id: int
    title: str
    body: str
    is_resolved: bool
    created_at: datetime
    answers: list[QAAnswerOut] = []

    model_config = {"from_attributes": True}


# ── Calendar ────────────────────────────────────────────────────────
class CalendarEventCreate(BaseModel):
    title: str
    description: str = ""
    event_date: datetime
    course_id: int | None = None
    is_global: bool = False


class CalendarEventOut(BaseModel):
    id: int
    title: str
    description: str
    event_date: datetime
    course_id: int | None
    user_id: int | None
    is_global: bool

    model_config = {"from_attributes": True}


# ── Leaderboard ─────────────────────────────────────────────────────
class LeaderboardEntry(BaseModel):
    user_id: int
    full_name: str
    avatar_url: str
    department_name: str | None
    points: int
    badges_count: int
    rank: int


# ── Enrollment ──────────────────────────────────────────────────────
class EnrollmentOut(BaseModel):
    id: int
    user_id: int
    course_id: int
    enrolled_at: datetime
    completed_at: datetime | None
    course_title: str = ""
    course_thumbnail: str = ""
    progress_percent: float = 0.0

    model_config = {"from_attributes": True}


# ── Admin Stats ─────────────────────────────────────────────────────
class AdminStats(BaseModel):
    total_users: int
    total_courses: int
    total_enrollments: int
    total_completions: int
    active_users_30d: int
