import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import type { Course, Module, Review } from "../types";
import toast from "react-hot-toast";
import { FiBookOpen, FiClock, FiUsers, FiStar, FiChevronDown, FiChevronRight, FiPlay, FiFileText, FiHeart, FiCheck } from "react-icons/fi";

const levelLabels: Record<string, string> = { beginner: "Cơ bản", intermediate: "Trung cấp", advanced: "Nâng cao" };

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "reviews" | "qa">("overview");

  useEffect(() => {
    if (!id) return;
    api.get<Course>(`/courses/${id}`).then((r) => setCourse(r.data));
    api.get<Module[]>(`/courses/${id}/modules`).then((r) => setModules(r.data));
    api.get<Review[]>(`/courses/${id}/reviews`).then((r) => setReviews(r.data));
    api.get("/enrollments/me").then((r) => {
      const found = r.data.some((e: any) => e.course_id === Number(id));
      setEnrolled(found);
    });
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      toast.success("Đăng ký khóa học thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Lỗi đăng ký");
    }
  };

  const handleWishlist = async () => {
    const { data } = await api.post(`/courses/${id}/wishlist`);
    setWishlisted(data.wishlisted);
    toast.success(data.wishlisted ? "Đã thêm vào yêu thích" : "Đã xóa khỏi yêu thích");
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/courses/${id}/reviews`, reviewForm);
      setReviews([data, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Đánh giá thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Lỗi");
    }
  };

  const toggleModule = (moduleId: number) => {
    const next = new Set(expandedModules);
    if (next.has(moduleId)) next.delete(moduleId);
    else next.add(moduleId);
    setExpandedModules(next);
  };

  const startLesson = (lessonId: number) => {
    if (!enrolled) {
      toast.error("Vui lòng đăng ký khóa học trước");
      return;
    }
    navigate(`/learn/${id}/${lessonId}`);
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.sections.reduce((s, sec) => s + sec.lessons.length, 0), 0);

  if (!course) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-6">
            {course.thumbnail_url ? (
              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-100"><FiBookOpen className="text-6xl text-primary-300" /></div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {(["overview", "curriculum", "reviews", "qa"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {{ overview: "Tổng quan", curriculum: "Nội dung", reviews: `Đánh giá (${reviews.length})`, qa: "Hỏi đáp" }[tab]}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Mô tả khóa học</h2>
              <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-900">{mod.title}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{mod.sections.reduce((s, sec) => s + sec.lessons.length, 0)} bài</span>
                      {expandedModules.has(mod.id) ? <FiChevronDown /> : <FiChevronRight />}
                    </div>
                  </button>
                  {expandedModules.has(mod.id) && (
                    <div className="divide-y divide-gray-100">
                      {mod.sections.map((sec) => (
                        <div key={sec.id}>
                          <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600">{sec.title}</div>
                          {sec.lessons.map((lesson) => (
                            <button key={lesson.id} onClick={() => startLesson(lesson.id)}
                              className="w-full flex items-center gap-3 px-6 py-3 hover:bg-primary-50 transition-colors text-left">
                              {lesson.lesson_type === "video" ? <FiPlay className="text-primary-500 flex-shrink-0" /> : <FiFileText className="text-gray-400 flex-shrink-0" />}
                              <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                              <span className="text-xs text-gray-400">{lesson.duration_minutes} phút</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {enrolled && (
                <form onSubmit={handleReview} className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <h3 className="font-medium mb-3">Đánh giá khóa học</h3>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                        className={`text-2xl ${s <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}`}>
                        <FiStar fill={s <= reviewForm.rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="input-field mb-3" rows={3} placeholder="Nhận xét của bạn..." />
                  <button type="submit" className="btn-primary">Gửi đánh giá</button>
                </form>
              )}
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                        {r.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{r.user_name}</p>
                        <div className="flex text-yellow-400 text-sm">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FiStar key={i} fill={i < r.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h1 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                {levelLabels[course.level]}
              </span>
              {course.category_name && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">{course.category_name}</span>
              )}
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><FiClock className="text-gray-400" />{course.duration_minutes} phút</div>
              <div className="flex items-center gap-2"><FiBookOpen className="text-gray-400" />{modules.length} module · {totalLessons} bài học</div>
              <div className="flex items-center gap-2"><FiUsers className="text-gray-400" />{course.enrollment_count} học viên</div>
              {course.avg_rating > 0 && (
                <div className="flex items-center gap-2"><FiStar className="text-yellow-400" />{course.avg_rating} / 5.0</div>
              )}
            </div>

            <div className="space-y-3">
              {enrolled ? (
                <button onClick={() => { const firstLesson = modules[0]?.sections[0]?.lessons[0]; if (firstLesson) navigate(`/learn/${id}/${firstLesson.id}`); }}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiPlay /> Tiếp tục học
                </button>
              ) : (
                <button onClick={handleEnroll} className="btn-primary w-full">
                  Đăng ký học (Miễn phí)
                </button>
              )}
              <button onClick={handleWishlist} className={`btn-secondary w-full flex items-center justify-center gap-2 ${wishlisted ? "text-red-500 border-red-200" : ""}`}>
                <FiHeart fill={wishlisted ? "currentColor" : "none"} /> {wishlisted ? "Đã yêu thích" : "Yêu thích"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
