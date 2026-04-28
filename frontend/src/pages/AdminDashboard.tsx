import { useEffect, useState } from "react";
import api from "../api";
import type { AdminStats, Course, User } from "../types";
import toast from "react-hot-toast";
import { FiUsers, FiBookOpen, FiTrendingUp, FiActivity, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "courses">("overview");

  useEffect(() => {
    api.get<AdminStats>("/admin/stats").then((r) => setStats(r.data));
    api.get<User[]>("/users").then((r) => setUsers(r.data));
    api.get<Course[]>("/courses").then((r) => setCourses(r.data));
  }, []);

  const toggleUserActive = async (userId: number) => {
    try {
      const { data } = await api.put(`/users/${userId}/toggle-active`);
      setUsers(users.map((u) => u.id === userId ? { ...u, is_active: data.is_active } : u));
      toast.success(data.is_active ? "Đã kích hoạt" : "Đã vô hiệu hóa");
    } catch {
      toast.error("Lỗi");
    }
  };

  const togglePublish = async (courseId: number, published: boolean) => {
    try {
      await api.put(`/courses/${courseId}`, { is_published: !published });
      setCourses(courses.map((c) => c.id === courseId ? { ...c, is_published: !published } : c));
      toast.success(!published ? "Đã xuất bản" : "Đã ẩn khóa học");
    } catch {
      toast.error("Lỗi");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Bảng điều khiển Admin</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {([["overview", "Tổng quan"], ["users", "Người dùng"], ["courses", "Khóa học"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && stats && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { icon: FiUsers, label: "Tổng người dùng", value: stats.total_users, color: "text-blue-600 bg-blue-50" },
              { icon: FiBookOpen, label: "Tổng khóa học", value: stats.total_courses, color: "text-purple-600 bg-purple-50" },
              { icon: FiTrendingUp, label: "Lượt đăng ký", value: stats.total_enrollments, color: "text-green-600 bg-green-50" },
              { icon: FiActivity, label: "Đã hoàn thành", value: stats.total_completions, color: "text-amber-600 bg-amber-50" },
              { icon: FiUsers, label: "Active 30 ngày", value: stats.active_users_30d, color: "text-red-600 bg-red-50" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Phòng ban</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Vai trò</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Điểm</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{u.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{u.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.department_name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                        {u.role === "admin" ? "Admin" : "Học viên"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-600">{u.points}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleUserActive(u.id)} className={`${u.is_active ? "text-green-500" : "text-gray-400"}`}>
                        {u.is_active ? <FiToggleRight className="text-xl" /> : <FiToggleLeft className="text-xl" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tên khóa học</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cấp độ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Danh mục</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Học viên</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{c.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.level}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.category_name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-right">{c.enrollment_count}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePublish(c.id, c.is_published)}
                        className={`text-xs font-medium px-3 py-1 rounded-full ${c.is_published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {c.is_published ? "Xuất bản" : "Ẩn"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
