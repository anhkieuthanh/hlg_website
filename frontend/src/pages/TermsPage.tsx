import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-primary-600 hover:underline mb-8"><FiArrowLeft /> Về trang chủ</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Điều khoản sử dụng</h1>
        <div className="prose max-w-none text-gray-600 space-y-6">
          <p><strong>Cập nhật lần cuối:</strong> Tháng 1, 2024</p>

          <h2 className="text-xl font-semibold text-gray-900">1. Giới thiệu</h2>
          <p>Chào mừng bạn đến với Hoàng Long Group Academy ("Nền tảng"), nền tảng đào tạo nội bộ thuộc sở hữu và vận hành bởi Công ty TNHH Hoàng Long Group ("Công ty"). Bằng việc truy cập và sử dụng Nền tảng, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây.</p>

          <h2 className="text-xl font-semibold text-gray-900">2. Tài khoản người dùng</h2>
          <p>Tài khoản được cấp cho nhân viên thuộc Hoàng Long Group. Bạn có trách nhiệm bảo mật thông tin đăng nhập và không chia sẻ tài khoản cho người khác. Mọi hoạt động dưới tài khoản của bạn đều thuộc trách nhiệm cá nhân.</p>

          <h2 className="text-xl font-semibold text-gray-900">3. Nội dung đào tạo</h2>
          <p>Toàn bộ nội dung khóa học, tài liệu, video, và bài kiểm tra trên Nền tảng là tài sản trí tuệ của Hoàng Long Group. Bạn không được phép sao chép, phân phối, hoặc sử dụng nội dung cho mục đích thương mại bên ngoài công ty.</p>

          <h2 className="text-xl font-semibold text-gray-900">4. Quyền và nghĩa vụ</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hoàn thành các khóa học bắt buộc theo yêu cầu của phòng ban.</li>
            <li>Tôn trọng nội dung và không gian học tập trực tuyến.</li>
            <li>Không gian lận trong bài kiểm tra hoặc bài tập.</li>
            <li>Báo cáo lỗi hệ thống hoặc nội dung không phù hợp.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">5. Bảo mật dữ liệu</h2>
          <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu học tập được lưu trữ an toàn và chỉ được sử dụng cho mục đích quản lý đào tạo nội bộ.</p>

          <h2 className="text-xl font-semibold text-gray-900">6. Chính sách hủy tài khoản</h2>
          <p>Tài khoản sẽ được vô hiệu hóa khi nhân viên rời công ty. Admin có quyền vô hiệu hóa hoặc xóa tài khoản bất cứ lúc nào.</p>

          <h2 className="text-xl font-semibold text-gray-900">7. Liên hệ</h2>
          <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ phòng Nhân sự hoặc Admin hệ thống.</p>
        </div>
      </div>
    </div>
  );
}
