import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import type { Category, Course } from "../types";
import { FiArrowRight, FiBookOpen, FiUsers, FiStar, FiClock, FiAward } from "react-icons/fi";

const levelLabels: Record<string, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function HomePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<Course[]>("/courses?limit=6").then((r) => setCourses(r.data));
    api.get<Category[]>("/categories").then((r) => setCategories(r.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Chào mừng đến
              <br />
              <span className="text-primary-200">Hoàng Long Group Academy</span>
            </h1>
            <p className="mt-4 text-lg text-primary-100">
              Nền tảng đào tạo nội bộ — nâng cao năng lực, phát triển sự nghiệp cùng đội ngũ Hoàng Long Group.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors">
                Khám phá khóa học <FiArrowRight className="inline ml-1" />
              </Link>
              <Link to="/dashboard" className="border border-primary-300 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors">
                Tiếp tục học
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FiBookOpen, label: "Khóa học", value: courses.length + "+" },
            { icon: FiUsers, label: "Học viên", value: "50+" },
            { icon: FiAward, label: "Chứng chỉ đã cấp", value: "200+" },
            { icon: FiStar, label: "Đánh giá TB", value: "4.8" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <s.icon className="text-primary-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Danh mục khóa học</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.id}`}
              className="bg-white rounded-xl p-5 text-center hover:shadow-md transition-shadow border border-gray-100"
            >
              <span className="text-3xl">{cat.icon}</span>
              <p className="mt-2 text-sm font-medium text-gray-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Khóa học nổi bật</h2>
          <Link to="/courses" className="text-primary-600 hover:underline font-medium text-sm">
            Xem tất cả <FiArrowRight className="inline" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card group">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100">
                    <FiBookOpen className="text-4xl text-primary-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>
                    {levelLabels[course.level]}
                  </span>
                  {course.category_name && (
                    <span className="text-xs text-gray-500">{course.category_name}</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiClock />{course.duration_minutes} phút</span>
                  <span className="flex items-center gap-1"><FiUsers />{course.enrollment_count} học viên</span>
                  {course.avg_rating > 0 && (
                    <span className="flex items-center gap-1"><FiStar className="text-yellow-400" />{course.avg_rating}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FiBookOpen className="text-primary-400" />
              <span className="font-semibold text-white">Hoàng Long Group Academy</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="hover:text-white">Điều khoản</Link>
              <Link to="/privacy" className="hover:text-white">Quyền riêng tư</Link>
              <Link to="/faq" className="hover:text-white">FAQ</Link>
            </div>
            <p className="text-sm">&copy; 2024 Hoàng Long Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
