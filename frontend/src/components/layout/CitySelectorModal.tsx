import React, { useState } from 'react';
import { MapPin, Search, Check } from 'lucide-react';
import { Modal } from '../common/Modal';

export interface City {
  id: string;
  name: string;
  cinemasCount: number;
}

export const POPULAR_CITIES: City[] = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh', cinemasCount: 14 },
  { id: 'hn', name: 'Hà Nội', cinemasCount: 11 },
  { id: 'dn', name: 'Đà Nẵng', cinemasCount: 4 },
  { id: 'hp', name: 'Hải Phòng', cinemasCount: 3 },
  { id: 'ct', name: 'Cần Thơ', cinemasCount: 3 },
  { id: 'bd', name: 'Bình Dương', cinemasCount: 4 },
  { id: 'nt', name: 'Nha Trang', cinemasCount: 2 },
  { id: 'vt', name: 'Vũng Tàu', cinemasCount: 2 },
  { id: 'hue', name: 'Thừa Thiên Huế', cinemasCount: 2 },
  { id: 'qn', name: 'Quảng Ninh', cinemasCount: 2 },
];

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: City) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2 text-base">
          <MapPin className="w-5 h-5 text-[var(--primary)]" />
          <span>Chọn Tỉnh / Thành phố</span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search city input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-sub)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên tỉnh, thành phố..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            autoFocus
          />
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredCities.map((city) => {
            const isSelected = selectedCity === city.name;
            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-bold shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-main)]'
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{city.name}</div>
                  <div className="text-xs text-[var(--text-sub)] font-normal">
                    {city.cinemasCount} cụm rạp
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[var(--primary)] shrink-0" />}
              </button>
            );
          })}
        </div>

        {filteredCities.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--text-sub)]">
            Không tìm thấy tỉnh thành phù hợp với từ khóa "{searchQuery}".
          </div>
        )}
      </div>
    </Modal>
  );
};
