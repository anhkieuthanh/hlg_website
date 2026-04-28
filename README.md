# Hoàng Long Group Academy

Nền tảng đào tạo nội bộ doanh nghiệp — Hoàng Long Group.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | FastAPI + SQLAlchemy (async) + PostgreSQL |
| Cache | Redis |
| Container | Docker Compose |
| Font | Be Vietnam Pro (Google Fonts) |

## Quick Start

```bash
# Clone repo
git clone <repo-url>
cd hlg-academy

# Start all services
docker compose up --build

# Access
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/docs
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hlg.vn | admin123 |
| Student | nguyenvana@hlg.vn | 123456 |
| Student | tranthib@hlg.vn | 123456 |
| Student | levanc@hlg.vn | 123456 |

## Features

- **Authentication**: Email/Password login, JWT token
- **Course Management**: Admin CRUD, Module → Section → Lesson hierarchy
- **Video Lessons**: YouTube/Vimeo embed with content protection
- **Quiz System**: Multiple choice, True/False, Short answer
- **Assignment System**: File upload, Link submission, Auto-grading
- **Gamification**: Points, Badges, Leaderboard
- **Department Cohorts**: Assign courses to departments
- **Progress Tracking**: Mark lessons complete, enrollment tracking
- **Reviews & Ratings**: 5-star rating with comments
- **Q&A Forum**: Per-course Q&A with answers
- **Bookmarks & Notes**: Personal bookmarks and notes per lesson
- **Calendar**: Personal and global events
- **FAQ**: Global and per-course FAQ
- **Wishlist**: Save courses for later
- **Admin Dashboard**: User management, course management, analytics
- **Terms & Privacy**: Generated legal pages (GDPR compliant)

## API Documentation

Backend API docs available at: http://localhost:8000/docs (Swagger UI)

## Project Structure

```
hlg-academy/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # FastAPI app + lifespan
│       ├── config.py         # Settings management
│       ├── database.py       # Async SQLAlchemy setup
│       ├── security.py       # JWT + bcrypt
│       ├── models.py         # 23 SQLAlchemy models
│       ├── schemas.py        # Pydantic DTOs
│       ├── deps.py           # Auth dependencies
│       ├── seed.py           # Sample data seeder
│       └── routers/          # API endpoints
│           ├── auth.py
│           ├── users.py
│           ├── courses.py
│           ├── quizzes.py
│           ├── assignments.py
│           ├── reviews.py
│           ├── gamification.py
│           ├── departments.py
│           ├── extras.py
│           └── admin.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api.ts
        ├── types.ts
        ├── index.css
        ├── contexts/
        │   └── AuthContext.tsx
        ├── layouts/
        │   ├── MainLayout.tsx
        │   └── LearningLayout.tsx
        └── pages/
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            ├── HomePage.tsx
            ├── CourseCatalog.tsx
            ├── CourseDetail.tsx
            ├── LearningPage.tsx
            ├── Dashboard.tsx
            ├── ProfilePage.tsx
            ├── LeaderboardPage.tsx
            ├── FAQPage.tsx
            ├── CalendarPage.tsx
            ├── AdminDashboard.tsx
            ├── TermsPage.tsx
            └── PrivacyPage.tsx
```

## License

Internal use only — Hoàng Long Group &copy; 2024
