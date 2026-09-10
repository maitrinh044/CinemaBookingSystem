import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title: string;
  description: string;
}

const ROUTE_SEO_MAP: Record<string, SEOConfig> = {
  '/': {
    title: 'CineGlow - Rạp Chiếu Phim & Đặt Vé Trực Tuyến Hàng Đầu',
    description: 'CineGlow Cinema - Hệ thống đặt vé xem phim trực tuyến hiện đại. Xem lịch chiếu, chọn ghế phòng vé thời gian thực và nhận vé điện tử tức thì.',
  },
  '/movies': {
    title: 'Phim Đang Chiếu & Sắp Chiếu Rạp Mới Nhất | CineGlow',
    description: 'Khám phá danh sách các bộ phim bom tấn rạp chiếu mới nhất, lịch chiếu IMAX, 2D, trailer và thông tin diễn viên.',
  },
  '/showtimes': {
    title: 'Lịch Chiếu Phim Toàn Quốc Hôm Nay | CineGlow',
    description: 'Tra cứu lịch chiếu phim tại tất cả các cụm rạp CineGlow trên toàn quốc. Đặt vé nhanh, chọn suất chiếu phù hợp nhất.',
  },
  '/cinemas': {
    title: 'Hệ Thống Cụm Rạp Chiếu Phim & Phòng Vé | CineGlow',
    description: 'Danh sách các cụm rạp CineGlow hiện đại, phòng chiếu IMAX Laser, Dolby Atmos, Gold Class tại TP.HCM, Hà Nội, Đà Nẵng.',
  },
  '/concessions': {
    title: 'Thực Đơn Bắp Nước & Combo Ưu Đãi Cinema | CineGlow',
    description: 'Bắp rang bơ nóng giòn ngô nhập khẩu Mỹ, nước ngọt mát lạnh và các combo gia đình ưu đãi đến 25%.',
  },
  '/promotions': {
    title: 'Khuyến Mãi & Ưu Đãi Vé Xem Phim Hot Nhất | CineGlow',
    description: 'Tổng hợp các mã giảm giá vé xem phim, ưu đãi học sinh - sinh viên, ngày hội thành viên VIP và đối tác thanh toán VNPAY, MoMo.',
  },
  '/booking': {
    title: 'Chọn Ghế Phòng Chiếu & Đặt Vé Thời Gian Thực | CineGlow',
    description: 'Bản đồ chọn ghế trực quan: ghế VIP, ghế Couple Sweetbox, ghế tiêu chuẩn. Giữ chỗ an toàn trong 5 phút.',
  },
  '/ticket-success': {
    title: 'Đặt Vé Thành Công & Vé Điện Tử E-Ticket | CineGlow',
    description: 'Vé xem phim điện tử của bạn đã sẵn sàng. Xuất trình mã QR tại rạp chiếu hoặc tải ảnh vé về điện thoại.',
  },
  '/profile': {
    title: 'Hồ Sơ Thành Viên & Lịch Sử Vé Đã Đặt | CineGlow',
    description: 'Quản lý thông tin tài khoản thành viên, điểm thưởng CinePoint và tra cứu danh sách vé xem phim đã mua.',
  },
  '/auth': {
    title: 'Đăng Nhập & Đăng Ký Tài Khoản Thành Viên | CineGlow',
    description: 'Đăng nhập hoặc tạo tài khoản thành viên CineGlow để nhận ngay 50 điểm CinePoint và đặc quyền vé VIP.',
  },
};

export const usePageSEO = (customTitle?: string, customDescription?: string) => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const config =
      pathname.startsWith('/movie/') && customTitle
        ? {
            title: `${customTitle} | CineGlow Cinema`,
            description: customDescription || `Thông tin phim, lịch chiếu và đặt vé xem phim ${customTitle} tại CineGlow.`,
          }
        : ROUTE_SEO_MAP[pathname] || {
            title: 'CineGlow - Rạp Chiếu Phim & Đặt Vé Trực Tuyến',
            description: 'Hệ thống đặt vé xem phim trực tuyến hiện đại chuẩn rạp cao cấp.',
          };

    document.title = config.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.description);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', config.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', config.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);
  }, [location.pathname, customTitle, customDescription]);
};
