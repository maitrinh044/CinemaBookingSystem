import React, { useState } from 'react';
import { Plus, Minus, Popcorn } from 'lucide-react';
import type { ConcessionItem, SelectedConcession } from '../../types/booking';
import { MOCK_CONCESSIONS } from '../../data/mockBookingData';

export interface ConcessionsStepProps {
  selectedConcessions: SelectedConcession[];
  onUpdateQuantity: (item: ConcessionItem, delta: number) => void;
}

export const ConcessionsStep: React.FC<ConcessionsStepProps> = ({
  selectedConcessions,
  onUpdateQuantity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'combo', label: 'Combo Tiết Kiệm' },
    { id: 'popcorn', label: 'Bắp Rang' },
    { id: 'drink', label: 'Nước Ngọt' },
    { id: 'snack', label: 'Snack & Món Nóng' },
  ];

  const filteredItems = MOCK_CONCESSIONS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getQuantity = (id: string) => {
    const found = selectedConcessions.find((sc) => sc.item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-2">
            <Popcorn className="w-5 h-5 text-[var(--gold)]" />
            <span>Combo Bắp Nước & Đồ Ăn Kèm</span>
          </h2>
          <p className="text-xs text-[var(--text-sub)] mt-0.5">
            Thêm bắp nước để buổi xem phim của bạn thêm trọn vẹn và nhiều cảm xúc
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[var(--primary)] text-white shadow-sm shadow-red-600/30'
                  : 'bg-[var(--surface-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Concessions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const qty = getQuantity(item.id);

          return (
            <div
              key={item.id}
              className={`relative glass-panel rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                qty > 0
                  ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/50 shadow-lg shadow-red-600/10'
                  : 'border-[var(--border-color)] hover:border-slate-500'
              }`}
            >
              {/* Badge */}
              {item.badge && (
                <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[var(--primary)] text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                  {item.badge}
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[var(--text-sub)] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price & Quantity Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <div>
                    <span className="text-sm sm:text-base font-black text-[var(--text-main)]">
                      {item.price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs text-[var(--text-sub)] ml-0.5">đ</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-[var(--surface-hover)] p-1 rounded-xl border border-[var(--border-color)]">
                    <button
                      type="button"
                      disabled={qty === 0}
                      onClick={() => onUpdateQuantity(item, -1)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        qty === 0
                          ? 'opacity-30 cursor-not-allowed text-[var(--text-sub)]'
                          : 'bg-[var(--surface)] text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white'
                      }`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-6 text-center text-xs font-black text-[var(--text-main)]">
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item, 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] flex items-center justify-center transition-colors cursor-pointer shadow-sm shadow-red-600/30"
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
    </div>
  );
};
