import React, { useState } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  Clock, 
  Tag, 
  Info, 
  ArrowRight
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../contexts/ToastContext';

export interface PromotionsPageProps {
  onNavigateToBooking: () => void;
}

interface PromoItem {
  id: string;
  title: string;
  category: 'vip' | 'student' | 'payment' | 'combo' | 'event';
  badge: string;
  image: string;
  validity: string;
  code: string;
  description: string;
  conditions: string[];
}

const PROMOTIONS_DATA: PromoItem[] = [
  {
    id: 'promo-happy-tuesday',
    title: 'Happy Tuesday - Đồng Giá Vé 65.000đ Thứ Ba',
    category: 'event',
    badge: 'HOT NHẤT TUẦN',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    validity: 'Áp dụng vào mọi ngày Thứ Ba hàng tuần',
    code: 'HAPPY65K',
    description: 'Thưởng thức mọi bộ phim 2D bom tấn vào ngày thứ Ba vui vẻ với mức giá chỉ 65.000đ/vé tại tất cả cụm rạp CineGlow.',
    conditions: [
      'Áp dụng cho tất cả suất chiếu 2D tiêu chuẩn trong ngày Thứ Ba.',
      'Không áp dụng cho phòng chiếu IMAX, 4DX hoặc Gold Class.',
      'Không áp dụng trùng với các chương trình khuyến mãi khác.',
      'Mỗi thành viên được mua tối đa 4 vé/ngày.'
    ],
  },
  {
    id: 'promo-student-u22',
    title: 'CineGlow U22 - Giá Vé 60.000đ Cho Học Sinh Sinh Viên',
    category: 'student',
    badge: 'DÀNH RIÊNG HSSV',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    validity: 'Áp dụng từ Thứ Hai đến Thứ Sáu (trước 17:00)',
    code: 'U22STUDENT',
    description: 'Chương trình trợ giá xem phim dành riêng cho các bạn học sinh, sinh viên và thanh thiếu niên dưới 22 tuổi.',
    conditions: [
      'Xuất trình thẻ học sinh/sinh viên hoặc CCCD khi nhận vé tại quầy soát vé.',
      'Áp dụng cho mọi suất chiếu 2D trước 17:00 các ngày trong tuần (trừ ngày Lễ/Tết).',
      'Giá vé đã bao gồm thuế VAT.'
    ],
  },
  {
    id: 'promo-vip-double-points',
    title: 'Thành Viên VIP - Nhân Đôi CinePoint & Tặng Bắp Nước',
    category: 'vip',
    badge: 'ĐẶC QUYỀN VIP',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    validity: 'Áp dụng Thứ Tư hàng tuần',
    code: 'VIPDOUBLE',
    description: 'Ngày hội thành viên CineGlow: Nhận ngay x2 điểm thưởng CinePoint khi đặt vé và tặng 01 bắp rang bơ phô mai lớn.',
    conditions: [
      'Dành riêng cho khách hàng có hạng thẻ Silver, Gold và VIP Diamond.',
      'Điểm thưởng sẽ được cộng tự động vào tài khoản sau khi quét vé rạp.',
      'Nhận bắp miễn phí tại quầy Concessions bằng cách trình mã thành viên.'
    ],
  },
  {
    id: 'promo-vnpay-cashback',
    title: 'Giảm 30.000đ Khi Thanh Toán Qua Ví VNPAY / MoMo',
    category: 'payment',
    badge: 'CỔNG THANH TOÁN',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    validity: 'Đến hết ngày 31/12/2026',
    code: 'VNPAY30K',
    description: 'Nhập mã VNPAY30K tại bước thanh toán để nhận ngay chiết khấu trực tiếp 30.000đ cho đơn hàng từ 150.000đ.',
    conditions: [
      'Áp dụng khi thanh toán bằng hình thức Quét mã VNPAY QR hoặc Ví MoMo.',
      'Mỗi tài khoản ví được hưởng ưu đãi 02 lần/tháng.',
      'Số lượng mã có hạn mỗi ngày.'
    ],
  },
  {
    id: 'promo-couple-sweetbox',
    title: 'Combo Cặp Đôi SweetBox - Trọn Gói Phim + Bắp Nước',
    category: 'combo',
    badge: 'DÀNH CHO 2 NGƯỜI',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80',
    validity: 'Áp dụng tất cả các ngày trong tuần',
    code: 'SWEETPAIR',
    description: 'Trải nghiệm ghế đôi SweetBox êm ái cùng combo 1 bắp lớn vị phô mai ngọt và 2 ly nước ngọt mát lạnh giá siêu hời.',
    conditions: [
      'Gói combo áp dụng khi đặt 1 cặp ghế đôi Couple (Row J) bất kỳ.',
      'Tiết kiệm hơn 25% so với mua vé và bắp nước riêng lẻ.'
    ],
  },
];

export const PromotionsPage: React.FC<PromotionsPageProps> = ({
  onNavigateToBooking,
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeModalPromo, setActiveModalPromo] = useState<PromoItem | null>(null);

  const categories = [
    { id: 'all', label: 'Tất Cả Ưu Đãi' },
    { id: 'event', label: 'Sự Kiện Trong Tuần' },
    { id: 'student', label: 'Học Sinh - Sinh Viên' },
    { id: 'vip', label: 'Đặc Quyền VIP' },
    { id: 'payment', label: 'Đối Tác Thanh Toán' },
    { id: 'combo', label: 'Combo Vé & Bắp' },
  ];

  const filteredPromos = PROMOTIONS_DATA.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(
      'Đã sao chép mã ưu đãi!',
      `Mã ${code} đã sẵn sàng. Bạn có thể dán mã tại bước thanh toán để nhận giảm giá!`
    );
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto text-left">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/85 to-transparent z-0" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold border border-[var(--primary)]/20">
            <Gift className="w-3.5 h-3.5" />
            <span>Ưu Đãi Độc Quyền</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            Khuyến Mãi & Quà Tặng CineGlow
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)]">
            Săn vé giá rẻ, mã giảm giá thanh toán ví điện tử và các đặc quyền nhân đôi điểm tích lũy dành riêng cho khán giả CineGlow.
          </p>
        </div>
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat.id
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-red-600/30'
                : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-slate-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Promo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromos.map((promo) => (
          <div
            key={promo.id}
            className="glass-panel rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl flex flex-col justify-between hover:border-[var(--primary)]/40 transition-all duration-300 group"
          >
            {/* Promo Header Image */}
            <div className="relative h-48 sm:h-52 overflow-hidden bg-[var(--surface)]">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-wider shadow">
                {promo.badge}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-sub)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{promo.validity}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  {promo.title}
                </h3>
                <p className="text-xs text-[var(--text-sub)] line-clamp-2">
                  {promo.description}
                </p>
              </div>

              {/* Code Box & Buttons */}
              <div className="pt-3 border-t border-[var(--border-color)] space-y-3">
                {/* Coupon Code Block */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface-hover)] border border-dashed border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className="font-mono text-xs font-black text-[var(--text-main)] tracking-wider">
                      {promo.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--card-elevated)] hover:bg-[var(--primary)] hover:text-white transition-colors text-[10px] font-bold text-[var(--text-main)] cursor-pointer"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalPromo(promo)}
                    className="w-full py-2 px-2.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Điều Kiện</span>
                  </button>
                  <button
                    onClick={onNavigateToBooking}
                    className="w-full py-2 px-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-red-600/30"
                  >
                    <span>Đặt Vé</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Terms & Conditions Modal */}
      {activeModalPromo && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModalPromo(null)}
          title={activeModalPromo.title}
          size="md"
        >
          <div className="space-y-4 py-2 text-left">
            <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-1">
              <div className="text-xs font-bold text-[var(--gold)]">Thời Gian Hiệu Lực:</div>
              <div className="text-xs text-[var(--text-main)] font-semibold">{activeModalPromo.validity}</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                Thể Lệ & Điều Kiện Áp Dụng:
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-sub)]">
                {activeModalPromo.conditions.map((cond, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--primary)] font-bold mt-0.5">•</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-sub)]">Mã ưu đãi:</span>
                <span className="font-mono text-xs font-black text-[var(--gold)] px-2 py-0.5 rounded bg-[var(--surface-hover)]">
                  {activeModalPromo.code}
                </span>
              </div>
              <button
                onClick={() => {
                  handleCopyCode(activeModalPromo.code);
                  setActiveModalPromo(null);
                  onNavigateToBooking();
                }}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:brightness-110 shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                Áp Dụng & Đặt Vé
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
