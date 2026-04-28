import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiBookOpen, FiGrid, FiUser, FiAward, FiCalendar, FiHelpCircle, FiLogOut, FiShield } from "react-icons/fi";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <FiBookOpen className="text-white text-lg" />
              </div>
              <span className="font-bold text-lg text-gray-900">HLG Academy</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Trang chủ
              </Link>
              <Link to="/courses" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Khóa học
              </Link>
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Học tập
              </Link>
              <Link to="/leaderboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Bảng xếp hạng
              </Link>
              <Link to="/calendar" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                Lịch
              </Link>
              <Link to="/faq" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                FAQ
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                  <FiShield className="inline mr-1" />Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                <FiAward className="text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">{user?.points ?? 0} điểm</span>
              </div>
              <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                  {user?.full_name?.charAt(0) ?? "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.full_name}</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Đăng xuất">
                <FiLogOut />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className="flex flex-col items-center text-xs text-gray-500 hover:text-primary-600">
            <FiGrid className="text-lg mb-0.5" /><span>Trang chủ</span>
          </Link>
          <Link to="/courses" className="flex flex-col items-center text-xs text-gray-500 hover:text-primary-600">
            <FiBookOpen className="text-lg mb-0.5" /><span>Khóa học</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center text-xs text-gray-500 hover:text-primary-600">
            <FiUser className="text-lg mb-0.5" /><span>Học tập</span>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center text-xs text-gray-500 hover:text-primary-600">
            <FiAward className="text-lg mb-0.5" /><span>Xếp hạng</span>
          </Link>
        </div>
      </nav>

      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
