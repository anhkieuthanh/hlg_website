import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import type { Enrollment, Badge, Bookmark } from "../types";
import { FiBookOpen, FiAward, FiBookmark, FiPlay, FiTrendingUp } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tab, setTab] = useState<"courses" | "badges" | "bookmarks">("courses");

  useEffect(() => {
    api.get<Enrollment[]>("/enrollments/me").then((r) => setEnrollments(r.data));
    api.get<Badge[]>("/gamification/my-badges").then((r) => setBadges(r.data));
    api.get<Bookmark[]>("/bookmarks/me").then((r) => setBookmarks(r.data));
  }, []);

  const inProgress = enrollments.filter((e) => !e.completed_at);
  const completed = enrollments.filter((e) => e.completed_at);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Xin chào, {user?.full_name}!</h1>
      <p className="text-gray-500 mb-8">Theo dõi tiến độ học tập của bạn</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><FiBookOpen className="text-primary-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              <p className="text-xs text-gray-500">Khóa đã đăng ký</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><FiTrendingUp className="text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completed.length}</p>
              <p className="text-xs text-gray-500">Đã hoàn thành</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><FiAward className="text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user?.points ?? 0}</p>
              <p className="text-xs text-gray-500">Điểm tích lũy</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center"><FiAward className="text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{badges.length}</p>
              <p className="text-xs text-gray-500">Huy hiệu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {([["courses", "Khóa học của tôi"], ["badges", "Huy hiệu"], ["bookmarks", "Bookmark"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "courses" && (
        <div>
          {inProgress.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Đang học ({inProgress.length})</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgress.map((e) => (
                  <div key={e.id} className="card p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                        {e.course_thumbnail ? <img src={e.course_thumbnail} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary-100" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{e.course_title}</h4>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Tiến độ</span>
                            <span>{e.progress_percent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${e.progress_percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link to={`/courses/${e.course_id}`} className="mt-3 flex items-center justify-center gap-1 text-sm text-primary-600 hover:underline">
                      <FiPlay className="text-xs" /> Tiếp tục học
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Đã hoàn thành ({completed.length})</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((e) => (
                  <div key={e.id} className="card p-5 border-green-200 bg-green-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><FiBookOpen className="text-green-600" /></div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{e.course_title}</h4>
                        <p className="text-xs text-green-600">Hoàn thành</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {enrollments.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FiBookOpen className="text-5xl mx-auto mb-4 text-gray-300" />
              <p>Bạn chưa đăng ký khóa học nào</p>
              <Link to="/courses" className="btn-primary inline-block mt-4">Khám phá khóa học</Link>
            </div>
          )}
        </div>
      )}

      {tab === "badges" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.length > 0 ? badges.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <span className="text-4xl">{b.icon}</span>
              <h4 className="font-medium text-sm mt-2">{b.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{b.description}</p>
              <p className="text-xs text-amber-600 mt-1">+{b.points_value} điểm</p>
            </div>
          )) : (
            <p className="col-span-4 text-center py-10 text-gray-500">Chưa có huy hiệu nào. Hoàn thành khóa học để nhận!</p>
          )}
        </div>
      )}

      {tab === "bookmarks" && (
        <div className="space-y-2">
          {bookmarks.length > 0 ? bookmarks.map((b) => (
            <div key={b.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <FiBookmark className="text-yellow-500" />
              <span className="text-sm font-medium">{b.lesson_title}</span>
              <span className="text-xs text-gray-400 ml-auto">{new Date(b.created_at).toLocaleDateString("vi-VN")}</span>
            </div>
          )) : (
            <p className="text-center py-10 text-gray-500">Chưa có bookmark nào</p>
          )}
        </div>
      )}
    </div>
  );
}
