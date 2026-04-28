import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiEdit2 } from "react-icons/fi";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    position: user?.position || "",
  });

  const handleSave = async () => {
    try {
      await api.put("/users/me", form);
      await refreshUser();
      setEditing(false);
      toast.success("Cập nhật thành công!");
    } catch {
      toast.error("Lỗi cập nhật");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-primary-600 text-3xl font-bold">
              {user.full_name.charAt(0)}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{user.full_name}</h2>
              <p className="text-primary-200">{user.position || "Nhân viên"}</p>
              <p className="text-primary-200 text-sm">{user.department_name || "Chưa có phòng ban"}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                  <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="btn-primary">Lưu thay đổi</button>
                <button onClick={() => setEditing(false)} className="btn-secondary">Hủy</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Thông tin cá nhân</h3>
                <button onClick={() => setEditing(true)} className="text-primary-600 hover:underline text-sm flex items-center gap-1">
                  <FiEdit2 className="text-xs" /> Chỉnh sửa
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="text-sm">{user.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiBriefcase className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Chức vụ</p>
                    <p className="text-sm">{user.position || "Chưa cập nhật"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Vai trò</p>
                    <p className="text-sm">{user.role === "admin" ? "Quản trị viên" : "Học viên"}</p>
                  </div>
                </div>
                {user.bio && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Giới thiệu</p>
                    <p className="text-sm text-gray-700">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
