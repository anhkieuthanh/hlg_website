import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-primary-600 hover:underline mb-8"><FiArrowLeft /> Về trang chủ</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Chính sách quyền riêng tư</h1>
        <div className="prose max-w-none text-gray-600 space-y-6">
          <p><strong>Cập nhật lần cuối:</strong> Tháng 1, 2024</p>

          <h2 className="text-xl font-semibold text-gray-900">1. Thông tin chúng tôi thu thập</h2>
          <p>Hoàng Long Group Academy thu thập các thông tin sau để phục vụ mục đích đào tạo nội bộ:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Thông tin cá nhân: Họ tên, email công ty, số điện thoại, chức vụ, phòng ban.</li>
            <li>Dữ liệu học tập: Tiến độ khóa học, kết quả bài kiểm tra, bài tập đã nộp.</li>
            <li>Hoạt động hệ thống: Thời gian truy cập, thiết bị sử dụng.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">2. Mục đích sử dụng</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Quản lý và theo dõi tiến độ đào tạo nhân viên.</li>
            <li>Cải thiện chất lượng nội dung khóa học.</li>
            <li>Tạo báo cáo thống kê cho ban quản lý.</li>
            <li>Gửi thông báo về khóa học và deadline.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">3. Bảo vệ dữ liệu</h2>
          <p>Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mã hóa mật khẩu bằng bcrypt.</li>
            <li>Xác thực qua JWT token có thời hạn.</li>
            <li>Giới hạn quyền truy cập theo vai trò (Admin/Học viên).</li>
            <li>Dữ liệu được lưu trữ trên hạ tầng nội bộ công ty.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">4. Chia sẻ thông tin</h2>
          <p>Chúng tôi <strong>không</strong> chia sẻ thông tin cá nhân của bạn với bên thứ ba. Dữ liệu chỉ được truy cập bởi admin hệ thống và quản lý phòng ban liên quan.</p>

          <h2 className="text-xl font-semibold text-gray-900">5. Quyền của bạn (GDPR)</h2>
          <p>Theo quy định GDPR, bạn có quyền:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Quyền truy cập:</strong> Xem thông tin cá nhân đã thu thập.</li>
            <li><strong>Quyền chỉnh sửa:</strong> Cập nhật thông tin cá nhân qua trang hồ sơ.</li>
            <li><strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản qua admin.</li>
            <li><strong>Quyền phản đối:</strong> Từ chối xử lý dữ liệu nhất định.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">6. Lưu trữ dữ liệu</h2>
          <p>Dữ liệu được lưu trữ trong suốt thời gian bạn là nhân viên. Sau khi rời công ty, dữ liệu sẽ được lưu trữ thêm 12 tháng trước khi xóa vĩnh viễn.</p>

          <h2 className="text-xl font-semibold text-gray-900">7. Liên hệ</h2>
          <p>Nếu bạn có câu hỏi về chính sách quyền riêng tư, vui lòng liên hệ phòng Nhân sự hoặc gửi email tới admin hệ thống.</p>
        </div>
      </div>
    </div>
  );
}
