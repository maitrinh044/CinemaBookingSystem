import React, { useState } from 'react';
import { 
  Popcorn, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Flame,
  Coffee,
  Cookie
} from 'lucide-react';
import { MOCK_CONCESSIONS } from '../../data/mockBookingData';
import type { ConcessionItem } from '../../types/booking';
import { useToast } from '../../contexts/ToastContext';

export interface ConcessionsPageProps {
  onNavigateToBooking?: () => void;
}

export const ConcessionsPage: React.FC<ConcessionsPageProps> = ({
  onNavigateToBooking,
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'Tất Cả Món', icon: <Popcorn className="w-4 h-4" /> },
    { id: 'combo', label: 'Combo Tiết Kiệm', icon: <Flame className="w-4 h-4" /> },
    { id: 'popcorn', label: 'Bắp Rang Nóng', icon: <Popcorn className="w-4 h-4" /> },
    { id: 'drink', label: 'Đồ Uống & Nước Ngọt', icon: <Coffee className="w-4 h-4" /> },
    { id: 'snack', label: 'Snack & Ăn Vặt', icon: <Cookie className="w-4 h-4" /> },
  ];

  const filteredItems = MOCK_CONCESSIONS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleUpdateQty = (item: ConcessionItem, delta: number) => {
    const currentQty = cart[item.id] || 0;
    const nextQty = Math.max(0, currentQty + delta);
    if (nextQty === 0) {
      const newCart = { ...cart };
      delete newCart[item.id];
      setCart(newCart);
    } else {
      setCart({ ...cart, [item.id]: nextQty });
    }
  };

  // Calculate cart stats
  const totalQuantity = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MOCK_CONCESSIONS.find((c) => c.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleCheckoutConcessions = () => {
    setShowOrderSuccess(true);
    toast.success(
      'Đặt bắp nước thành công!',
      'Mã nhận món POP-8829 đã được tạo. Vui lòng đưa mã này tại quầy rạp để nhận ngay!'
    );
    setTimeout(() => {
      setShowOrderSuccess(false);
      setCart({});
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-28 max-w-7xl mx-auto text-left">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/85 to-transparent z-0" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold border border-[var(--primary)]/20">
            <Popcorn className="w-3.5 h-3.5" />
            <span>Thực Đơn Quầy Bar CineGlow</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            Bắp Nước & Ẩm Thực Cinema
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-sub)]">
            Bắp rang bơ nổ tươi mỗi 30 phút với hạt ngô nhập khẩu Mỹ, sốt caramel hảo hạng và combo tiết kiệm cho trải nghiệm xem phim trọn vẹn.
          </p>
        </div>
      </div>

      {/* 2. Success Feedback Toast */}
      {showOrderSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs sm:text-sm font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>Đã tạo mã nhận bắp nước nhanh tại quầy Concessions! Quý khách vui lòng xuất trình mã đơn tại quầy.</span>
          </div>
          <span className="font-mono text-xs font-bold bg-emerald-500 text-black px-2 py-0.5 rounded">
            MÃ: POP-8829
          </span>
        </div>
      )}

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat.id
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-red-600/30'
                : 'bg-[var(--surface-hover)] text-[var(--text-sub)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-slate-400'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Concession Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`glass-panel rounded-3xl border overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 ${
                qty > 0 ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/40' : 'border-[var(--border-color)] hover:border-slate-400'
              }`}
            >
              {/* Product Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[var(--surface)]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {item.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[var(--primary)] text-white text-[10px] font-black tracking-wider uppercase shadow">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Price & Counter */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="font-mono font-black text-base text-[var(--gold)]">
                    {item.price.toLocaleString('vi-VN')}đ
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-[var(--surface-hover)] border border-[var(--border-color)] p-1 rounded-xl">
                    <button
                      onClick={() => handleUpdateQty(item, -1)}
                      disabled={qty === 0}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        qty === 0
                          ? 'text-[var(--text-sub)]/30 cursor-not-allowed'
                          : 'text-[var(--text-main)] hover:bg-[var(--card-elevated)] cursor-pointer'
                      }`}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs text-[var(--text-main)]">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item, 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center hover:brightness-110 cursor-pointer shadow-sm"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Cinema Popcorn Quality Highlights */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-4 text-xs text-[var(--text-sub)]">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
          <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          <span>Tiêu Chuẩn Bắp Nước CineGlow Cinema</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-1">
            <div className="font-bold text-[var(--text-main)]">🌽 Ngô Bướm Nhập Khẩu 100%</div>
            <div>Hạt ngô nổ to đều, thơm xốp, hoàn toàn không chất bảo quản hay phụ gia độc hại.</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-1">
            <div className="font-bold text-[var(--text-main)]">🔥 Nổ Mới Mỗi 30 Phút</div>
            <div>Bắp luôn giữ được độ giòn rụm nóng hổi, lan tỏa mùi bơ béo ngậy khi thưởng thức phim.</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border-color)] space-y-1">
            <div className="font-bold text-[var(--text-main)]">🌱 Bao Bì Thân Thiện</div>
            <div>Ly giấy và hộp bắp tự phân hủy sinh học, bảo vệ sức khỏe và môi trường xanh.</div>
          </div>
        </div>
      </div>

      {/* 6. Floating Cart Bar (Fixed at bottom if items selected) */}
      {totalQuantity > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 animate-fade-in">
          <div className="glass-panel p-4 rounded-2xl border border-[var(--primary)]/50 shadow-2xl bg-black/90 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-sub)]">
                  Đã chọn: <b className="text-[var(--text-main)]">{totalQuantity} món</b>
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-[var(--gold)]">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCart({})}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-sub)] hover:text-white transition-colors cursor-pointer"
              >
                Xóa Hết
              </button>
              {onNavigateToBooking && (
                <button
                  onClick={onNavigateToBooking}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-white text-xs sm:text-sm font-bold hover:border-[var(--primary)] transition-all cursor-pointer hidden sm:inline-flex"
                >
                  Đặt Cùng Vé Phim
                </button>
              )}
              <button
                onClick={handleCheckoutConcessions}
                className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/40 hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Nhận Tại Quầy Rạp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
