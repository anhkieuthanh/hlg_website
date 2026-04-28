import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import type { Category, Course } from "../types";
import { FiSearch, FiBookOpen, FiClock, FiUsers, FiStar, FiFilter } from "react-icons/fi";

const levelLabels: Record<string, string> = { beginner: "Cơ bản", intermediate: "Trung cấp", advanced: "Nâng cao" };
const levelColors: Record<string, string> = { beginner: "bg-green-100 text-green-700", intermediate: "bg-yellow-100 text-yellow-700", advanced: "bg-red-100 text-red-700" };

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("category_id", categoryId);
    if (level) params.set("level", level);
    const { data } = await api.get<Course[]>(`/courses?${params}`);
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    api.get<Category[]>("/categories").then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [categoryId, level]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tất cả khóa học</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" placeholder="Tìm kiếm khóa học..."
            />
          </div>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field md:w-48">
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="input-field md:w-40">
            <option value="">Tất cả level</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <FiFilter /> Lọc
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" /></div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FiBookOpen className="text-5xl mx-auto mb-4 text-gray-300" />
          <p>Không tìm thấy khóa học nào</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card group">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100"><FiBookOpen className="text-4xl text-primary-300" /></div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>{levelLabels[course.level]}</span>
                  {course.category_name && <span className="text-xs text-gray-500">{course.category_name}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiClock />{course.duration_minutes} phút</span>
                  <span className="flex items-center gap-1"><FiUsers />{course.enrollment_count}</span>
                  {course.avg_rating > 0 && <span className="flex items-center gap-1"><FiStar className="text-yellow-400" />{course.avg_rating}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
