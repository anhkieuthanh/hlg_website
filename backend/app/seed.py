
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Badge,
    BadgeType,
    Category,
    Course,
    CourseLevel,
    Department,
    FAQItem,
    Lesson,
    LessonType,
    Module,
    Section,
    User,
    Role,
)
from app.security import hash_password


async def seed_data(db: AsyncSession):
    existing = await db.execute(select(User).where(User.email == "admin@hlg.vn"))
    if existing.scalar_one_or_none():
        return

    # Departments
    departments = [
        Department(name="Ban Giám đốc", description="Ban lãnh đạo"),
        Department(name="Phòng Kỹ thuật", description="Phòng kỹ thuật và công nghệ"),
        Department(name="Phòng Kinh doanh", description="Phòng kinh doanh và bán hàng"),
        Department(name="Phòng Nhân sự", description="Phòng quản lý nhân sự"),
        Department(name="Phòng Kế toán", description="Phòng tài chính kế toán"),
    ]
    db.add_all(departments)
    await db.flush()

    # Categories
    categories = [
        Category(name="Công nghệ thông tin", icon="💻", color="#2563eb"),
        Category(name="Quản lý & Lãnh đạo", icon="👔", color="#7c3aed"),
        Category(name="Kỹ năng mềm", icon="🤝", color="#059669"),
        Category(name="An toàn lao động", icon="🦺", color="#dc2626"),
        Category(name="Ngoại ngữ", icon="🌍", color="#d97706"),
        Category(name="Tài chính & Kế toán", icon="📊", color="#0891b2"),
    ]
    db.add_all(categories)
    await db.flush()

    # Users
    admin = User(
        email="admin@hlg.vn",
        hashed_password=hash_password("admin123"),
        full_name="Admin HLG",
        role=Role.ADMIN,
        department_id=departments[0].id,
        position="Quản trị viên hệ thống",
        points=0,
    )
    students = [
        User(
            email="nguyenvana@hlg.vn",
            hashed_password=hash_password("123456"),
            full_name="Nguyễn Văn A",
            role=Role.STUDENT,
            department_id=departments[1].id,
            position="Kỹ sư phần mềm",
        ),
        User(
            email="tranthib@hlg.vn",
            hashed_password=hash_password("123456"),
            full_name="Trần Thị B",
            role=Role.STUDENT,
            department_id=departments[2].id,
            position="Nhân viên kinh doanh",
        ),
        User(
            email="levanc@hlg.vn",
            hashed_password=hash_password("123456"),
            full_name="Lê Văn C",
            role=Role.STUDENT,
            department_id=departments[3].id,
            position="Chuyên viên nhân sự",
        ),
    ]
    db.add(admin)
    db.add_all(students)
    await db.flush()

    # Badges
    badges = [
        Badge(name="Khóa học đầu tiên", description="Hoàn thành khóa học đầu tiên", icon="🎯", badge_type=BadgeType.FIRST_COURSE, points_value=100),
        Badge(name="Hoàn thành xuất sắc", description="Hoàn thành khóa học với điểm cao", icon="⭐", badge_type=BadgeType.COURSE_COMPLETE, points_value=200),
        Badge(name="Streak 7 ngày", description="Học liên tục 7 ngày", icon="🔥", badge_type=BadgeType.STREAK, points_value=150),
        Badge(name="Top Learner", description="Đứng đầu bảng xếp hạng", icon="🏆", badge_type=BadgeType.TOP_LEARNER, points_value=500),
        Badge(name="Quiz Master", description="Đạt 100% tất cả quiz trong 1 khóa", icon="🧠", badge_type=BadgeType.QUIZ_MASTER, points_value=300),
    ]
    db.add_all(badges)
    await db.flush()

    # Courses with full structure
    course1 = Course(
        title="Python cơ bản cho người mới bắt đầu",
        slug="python-co-ban",
        description="Khóa học Python dành cho nhân viên muốn tìm hiểu lập trình. Bao gồm các kiến thức cơ bản về cú pháp, biến, hàm, và xử lý file.",
        thumbnail_url="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
        level=CourseLevel.BEGINNER,
        is_published=True,
        is_sequential=True,
        duration_minutes=90,
        category_id=categories[0].id,
    )
    course2 = Course(
        title="Kỹ năng giao tiếp trong doanh nghiệp",
        slug="ky-nang-giao-tiep",
        description="Nâng cao kỹ năng giao tiếp, thuyết trình và làm việc nhóm hiệu quả trong môi trường doanh nghiệp.",
        thumbnail_url="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        level=CourseLevel.INTERMEDIATE,
        is_published=True,
        is_sequential=False,
        duration_minutes=60,
        category_id=categories[2].id,
    )
    course3 = Course(
        title="An toàn lao động tại công trường",
        slug="an-toan-lao-dong",
        description="Khóa học bắt buộc về quy tắc an toàn lao động, phòng chống cháy nổ và sơ cứu cơ bản.",
        thumbnail_url="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
        level=CourseLevel.BEGINNER,
        is_published=True,
        is_sequential=True,
        duration_minutes=45,
        category_id=categories[3].id,
    )
    course4 = Course(
        title="Quản lý dự án với Agile/Scrum",
        slug="quan-ly-du-an-agile",
        description="Tìm hiểu phương pháp quản lý dự án Agile, Scrum framework, Sprint planning và Retrospective.",
        thumbnail_url="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
        level=CourseLevel.INTERMEDIATE,
        is_published=True,
        is_sequential=True,
        duration_minutes=75,
        category_id=categories[1].id,
    )
    course5 = Course(
        title="Excel nâng cao cho báo cáo tài chính",
        slug="excel-nang-cao",
        description="Sử dụng Excel pivot table, VLOOKUP, macro để tạo báo cáo tài chính chuyên nghiệp.",
        thumbnail_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        level=CourseLevel.ADVANCED,
        is_published=True,
        is_sequential=False,
        duration_minutes=120,
        category_id=categories[5].id,
    )
    db.add_all([course1, course2, course3, course4, course5])
    await db.flush()

    # Course 1 modules/sections/lessons
    m1 = Module(title="Giới thiệu Python", order=0, course_id=course1.id)
    m2 = Module(title="Cú pháp cơ bản", order=1, course_id=course1.id)
    m3 = Module(title="Hàm và Module", order=2, course_id=course1.id)
    db.add_all([m1, m2, m3])
    await db.flush()

    s1 = Section(title="Python là gì?", order=0, module_id=m1.id)
    s2 = Section(title="Cài đặt môi trường", order=1, module_id=m1.id)
    s3 = Section(title="Biến và kiểu dữ liệu", order=0, module_id=m2.id)
    s4 = Section(title="Câu lệnh điều kiện", order=1, module_id=m2.id)
    s5 = Section(title="Vòng lặp", order=2, module_id=m2.id)
    s6 = Section(title="Định nghĩa hàm", order=0, module_id=m3.id)
    db.add_all([s1, s2, s3, s4, s5, s6])
    await db.flush()

    lessons_data = [
        Lesson(title="Tổng quan về Python", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/kqtD5dpn9C8", duration_minutes=10, order=0, section_id=s1.id, content="Python là ngôn ngữ lập trình bậc cao, dễ học, mạnh mẽ."),
        Lesson(title="Lịch sử và ứng dụng", lesson_type=LessonType.TEXT, duration_minutes=5, order=1, section_id=s1.id, content="Python được tạo bởi Guido van Rossum năm 1991. Ứng dụng: web, data science, AI, automation."),
        Lesson(title="Cài đặt Python", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/YYXdXT2l-Gg", duration_minutes=8, order=0, section_id=s2.id, content="Hướng dẫn cài đặt Python trên Windows, macOS và Linux."),
        Lesson(title="Biến trong Python", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/cQT33yu9pY8", duration_minutes=12, order=0, section_id=s3.id, content="Biến là nơi lưu trữ dữ liệu. Python là ngôn ngữ dynamic typing."),
        Lesson(title="If/Else trong Python", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/Zp5MuPOtsSY", duration_minutes=10, order=0, section_id=s4.id, content="Câu lệnh if, elif, else dùng để điều khiển luồng chương trình."),
        Lesson(title="For và While loop", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/94UHCEmprCY", duration_minutes=15, order=0, section_id=s5.id, content="Vòng lặp for duyệt qua danh sách, while lặp khi điều kiện đúng."),
        Lesson(title="Tạo và gọi hàm", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/9Os0o3wzS_I", duration_minutes=12, order=0, section_id=s6.id, content="Hàm giúp tái sử dụng code. Cú pháp: def ten_ham(tham_so):"),
    ]
    db.add_all(lessons_data)
    await db.flush()

    # Course 2 modules
    m2_1 = Module(title="Giao tiếp cơ bản", order=0, course_id=course2.id)
    m2_2 = Module(title="Thuyết trình hiệu quả", order=1, course_id=course2.id)
    db.add_all([m2_1, m2_2])
    await db.flush()

    s2_1 = Section(title="Nguyên tắc giao tiếp", order=0, module_id=m2_1.id)
    s2_2 = Section(title="Kỹ năng thuyết trình", order=0, module_id=m2_2.id)
    db.add_all([s2_1, s2_2])
    await db.flush()

    db.add_all([
        Lesson(title="5 nguyên tắc giao tiếp hiệu quả", lesson_type=LessonType.VIDEO, video_url="https://www.youtube.com/embed/HAnw168huqA", duration_minutes=15, order=0, section_id=s2_1.id, content="Lắng nghe, đồng cảm, rõ ràng, tôn trọng, phản hồi."),
        Lesson(title="Cách thuyết trình trước đám đông", lesson_type=LessonType.SLIDE, duration_minutes=20, order=0, section_id=s2_2.id, content="Chuẩn bị slide, luyện tập, kiểm soát thời gian, tương tác khán giả."),
    ])

    # FAQ
    faq_items = [
        FAQItem(question="Làm sao để đăng ký khóa học?", answer="Vào trang khóa học, nhấn nút 'Đăng ký học' để bắt đầu.", order=0, is_global=True),
        FAQItem(question="Tôi có thể học trên điện thoại không?", answer="Website hỗ trợ responsive, tuy nhiên trải nghiệm tốt nhất trên desktop.", order=1, is_global=True),
        FAQItem(question="Chứng chỉ có giá trị không?", answer="Chứng chỉ được cấp bởi Hoàng Long Group Academy, công nhận nội bộ.", order=2, is_global=True),
        FAQItem(question="Quên mật khẩu thì làm sao?", answer="Liên hệ admin hoặc phòng IT để reset mật khẩu.", order=3, is_global=True),
        FAQItem(question="Có thể học lại khóa đã hoàn thành?", answer="Có, bạn có thể xem lại nội dung bất cứ lúc nào.", order=4, is_global=True),
    ]
    db.add_all(faq_items)

    await db.commit()
