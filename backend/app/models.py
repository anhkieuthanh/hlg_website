import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    Table,
)
from sqlalchemy.orm import relationship

from app.database import Base


# ── enums ───────────────────────────────────────────────────────────
class Role(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"


class CourseLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LessonType(str, enum.Enum):
    VIDEO = "video"
    TEXT = "text"
    SLIDE = "slide"
    MIXED = "mixed"


class QuizType(str, enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"


class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    GRADED = "graded"
    AUTO_GRADED = "auto_graded"


class BadgeType(str, enum.Enum):
    COURSE_COMPLETE = "course_complete"
    STREAK = "streak"
    TOP_LEARNER = "top_learner"
    QUIZ_MASTER = "quiz_master"
    FIRST_COURSE = "first_course"


def _utcnow():
    return datetime.now(timezone.utc)


# ── association tables ──────────────────────────────────────────────
course_prerequisites = Table(
    "course_prerequisites",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
    Column("prerequisite_id", Integer, ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
)

department_courses = Table(
    "department_courses",
    Base.metadata,
    Column("department_id", Integer, ForeignKey("departments.id", ondelete="CASCADE"), primary_key=True),
    Column("course_id", Integer, ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
)

user_wishlist = Table(
    "user_wishlist",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("course_id", Integer, ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
)


# ── models ──────────────────────────────────────────────────────────
class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    users = relationship("User", back_populates="department")
    courses = relationship("Course", secondary=department_courses, back_populates="departments")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200), nullable=False)
    avatar_url = Column(String(500), default="")
    bio = Column(Text, default="")
    phone = Column(String(20), default="")
    position = Column(String(200), default="")
    role = Column(Enum(Role), default=Role.STUDENT, nullable=False)
    is_active = Column(Boolean, default=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    points = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    department = relationship("Department", back_populates="users")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    wishlist_courses = relationship("Course", secondary=user_wishlist, back_populates="wishlisted_by")
    qa_questions = relationship("QAQuestion", back_populates="user", cascade="all, delete-orphan")
    qa_answers = relationship("QAAnswer", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    icon = Column(String(50), default="📚")
    color = Column(String(7), default="#1e40af")
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    courses = relationship("Course", back_populates="category")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    slug = Column(String(350), unique=True, index=True, nullable=False)
    description = Column(Text, default="")
    thumbnail_url = Column(String(500), default="")
    level = Column(Enum(CourseLevel), default=CourseLevel.BEGINNER)
    is_published = Column(Boolean, default=False)
    is_sequential = Column(Boolean, default=True)
    duration_minutes = Column(Integer, default=0)
    deadline = Column(DateTime(timezone=True), nullable=True)
    access_days = Column(Integer, nullable=True)  # null = unlimited
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow)
    updated_at = Column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    category = relationship("Category", back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan", order_by="Module.order")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="course", cascade="all, delete-orphan")
    prerequisites = relationship(
        "Course",
        secondary=course_prerequisites,
        primaryjoin="Course.id == course_prerequisites.c.course_id",
        secondaryjoin="Course.id == course_prerequisites.c.prerequisite_id",
        backref="required_by",
    )
    departments = relationship("Department", secondary=department_courses, back_populates="courses")
    wishlisted_by = relationship("User", secondary=user_wishlist, back_populates="wishlist_courses")
    faq_items = relationship("FAQItem", back_populates="course", cascade="all, delete-orphan")
    qa_questions = relationship("QAQuestion", back_populates="course", cascade="all, delete-orphan")


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    order = Column(Integer, default=0)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    course = relationship("Course", back_populates="modules")
    sections = relationship("Section", back_populates="module", cascade="all, delete-orphan", order_by="Section.order")


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    order = Column(Integer, default=0)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    module = relationship("Module", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete-orphan", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    lesson_type = Column(Enum(LessonType), default=LessonType.VIDEO)
    content = Column(Text, default="")
    video_url = Column(String(500), default="")
    duration_minutes = Column(Integer, default=0)
    order = Column(Integer, default=0)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False)
    attachment_url = Column(String(500), default="")
    attachment_name = Column(String(300), default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    section = relationship("Section", back_populates="lessons")
    progress = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="lesson", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="lesson", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="lesson", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), default=_utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    lesson = relationship("Lesson", back_populates="progress")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    passing_score = Column(Float, default=70.0)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan", order_by="QuizQuestion.order")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    quiz_type = Column(Enum(QuizType), default=QuizType.MULTIPLE_CHOICE)
    options = Column(Text, default="[]")  # JSON array for MC
    correct_answer = Column(Text, nullable=False)
    points = Column(Integer, default=10)
    order = Column(Integer, default=0)

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, default=0.0)
    answers = Column(Text, default="[]")  # JSON
    passed = Column(Boolean, default=False)
    attempted_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, default="")
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    max_score = Column(Float, default=100.0)
    allow_file_upload = Column(Boolean, default=True)
    allow_link = Column(Boolean, default=True)
    auto_grade = Column(Boolean, default=False)
    deadline = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    lesson = relationship("Lesson", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(String(500), default="")
    link_url = Column(String(500), default="")
    text_content = Column(Text, default="")
    score = Column(Float, nullable=True)
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING)
    feedback = Column(Text, default="")
    submitted_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="submissions")
    assignment = relationship("Assignment", back_populates="submissions")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="reviews")
    course = relationship("Course", back_populates="reviews")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="bookmarks")
    lesson = relationship("Lesson", back_populates="bookmarks")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="notes")
    lesson = relationship("Lesson", back_populates="notes")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    description = Column(Text, default="")
    icon = Column(String(50), default="🏆")
    badge_type = Column(Enum(BadgeType), nullable=False)
    points_value = Column(Integer, default=0)

    user_badges = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")


class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id", ondelete="CASCADE"), nullable=False)
    earned_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="user_badges")


class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    order = Column(Integer, default=0)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=True)
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    course = relationship("Course", back_populates="faq_items")


class QAQuestion(Base):
    __tablename__ = "qa_questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    body = Column(Text, default="")
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="qa_questions")
    course = relationship("Course", back_populates="qa_questions")
    answers = relationship("QAAnswer", back_populates="question", cascade="all, delete-orphan")


class QAAnswer(Base):
    __tablename__ = "qa_answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("qa_questions.id", ondelete="CASCADE"), nullable=False)
    body = Column(Text, nullable=False)
    is_accepted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    user = relationship("User", back_populates="qa_answers")
    question = relationship("QAQuestion", back_populates="answers")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, default="")
    event_date = Column(DateTime(timezone=True), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)
