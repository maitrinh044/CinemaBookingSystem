import type { Seat, ConcessionItem, CompletedBooking } from '../types/booking';
import { MOCK_MOVIES, MOCK_CINEMAS } from './mockData';

export const generateSeatsForShowtime = (_showtimeId: string, basePrice: number): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  const seats: Seat[] = [];

  // Deterministic "sold" seat pattern for realism
  const soldSet = new Set([
    'A-03', 'A-04',
    'B-05', 'B-06',
    'C-06', 'C-07',
    'E-05', 'E-06', 'E-07', 'E-08',
    'F-06', 'F-07',
    'G-04', 'G-05',
    'H-06', 'H-07',
    'J-03', 'J-04'
  ]);

  rows.forEach((row) => {
    if (row === 'J') {
      // Couple seats row (6 couple pairs = 12 seats)
      for (let col = 1; col <= 12; col++) {
        const id = `${row}-${col.toString().padStart(2, '0')}`;
        seats.push({
          id,
          row,
          col,
          type: 'couple',
          status: soldSet.has(id) ? 'sold' : 'available',
          price: Math.round(basePrice * 1.8), // e.g. 170.000đ - 190.000đ
        });
      }
    } else if (['E', 'F', 'G', 'H'].includes(row)) {
      // VIP Rows
      for (let col = 1; col <= 12; col++) {
        const id = `${row}-${col.toString().padStart(2, '0')}`;
        seats.push({
          id,
          row,
          col,
          type: 'vip',
          status: soldSet.has(id) ? 'sold' : 'available',
          price: basePrice + 25000,
        });
      }
    } else {
      // Standard Rows A, B, C, D
      for (let col = 1; col <= 12; col++) {
        const id = `${row}-${col.toString().padStart(2, '0')}`;
        seats.push({
          id,
          row,
          col,
          type: 'standard',
          status: soldSet.has(id) ? 'sold' : 'available',
          price: basePrice,
        });
      }
    }
  });

  return seats;
};

export const MOCK_CONCESSIONS: ConcessionItem[] = [
  {
    id: 'combo-duo-sweet',
    name: 'Combo CineGlow Duo VIP',
    description: '1 Bắp lớn 68oz (Phô mai / Caramel) + 2 Nước ngọt 32oz mát lạnh + 1 Snack khoai tây Lays',
    price: 119000,
    image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600&auto=format&fit=crop&q=80',
    badge: 'BÁN CHẠY NHẤT',
    category: 'combo',
  },
  {
    id: 'combo-solo-deluxe',
    name: 'Combo Solo Độc Hành',
    description: '1 Bắp rang bơ cỡ vừa (Ngọt / Mặn) + 1 Nước ngọt có ga 22oz tự chọn',
    price: 79000,
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&auto=format&fit=crop&q=80',
    badge: 'TIẾT KIỆM',
    category: 'combo',
  },
  {
    id: 'combo-party-family',
    name: 'Combo Family Party IMAX',
    description: '2 Bắp khổng lồ vị bơ phô mai + 4 Nước ngọt lớn + 2 Xúc xích Đức xông khói + 1 Kẹo M&M',
    price: 219000,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    badge: 'COMBO GIA ĐÌNH',
    category: 'combo',
  },
  {
    id: 'popcorn-cheese-large',
    name: 'Bắp Rang Phô Mai Đặc Biệt 68oz',
    description: 'Bắp nổ tươi giòn tan phủ bột phô mai hảo hạng thơm lừng',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80',
    category: 'popcorn',
  },
  {
    id: 'popcorn-caramel-large',
    name: 'Bắp Rang Vị Caramel Giòn Rụm 68oz',
    description: 'Bắp rang bơ ngào lớp sốt Caramel đường nâu ngọt ngào quyến rũ',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600&auto=format&fit=crop&q=80',
    category: 'popcorn',
  },
  {
    id: 'drink-pepsi-zero',
    name: 'Pepsi Không Calo 32oz',
    description: 'Nước ngọt có ga sảng khoái, không lo tăng cân trong suốt buổi xem phim',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80',
    category: 'drink',
  },
  {
    id: 'snack-hotdog',
    name: 'Xúc Xích Đức Nướng Phô Mai',
    description: '1 Xúc xích nướng vàng ươm ăn kèm sốt mù tạt mật ong và tương ớt cay nồng',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
    badge: 'MÓN NÓNG',
    category: 'snack',
  }
];

export const MOCK_PAST_BOOKINGS: CompletedBooking[] = [
  {
    bookingCode: 'CG-918234',
    movie: MOCK_MOVIES[0],
    cinema: MOCK_CINEMAS[0],
    date: '12/09/2026',
    showtime: {
      id: 'st-dune-01',
      movieId: 'dune-2',
      cinemaId: 'cineglow-l81',
      date: '2026-09-12',
      time: '19:30',
      format: 'IMAX',
      hallName: 'Phòng Chiếu IMAX Laser 01',
      price: 135000,
      availableSeats: 45,
      totalSeats: 120,
    },
    seats: [
      { id: 'F-06', row: 'F', col: 6, type: 'vip', status: 'selected', price: 160000 },
      { id: 'F-07', row: 'F', col: 7, type: 'vip', status: 'selected', price: 160000 },
    ],
    concessions: [
      {
        item: {
          id: 'combo-duo-sweet',
          name: 'Combo CineGlow Duo VIP',
          description: '1 Bắp lớn + 2 Nước ngọt mát lạnh',
          price: 119000,
          image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600&auto=format&fit=crop&q=80',
          category: 'combo',
        },
        quantity: 1,
      },
    ],
    customerInfo: {
      fullName: 'Nguyễn Mai Trinh',
      phone: '0988 668 886',
      email: 'maitrinh@cineglow.vn',
    },
    paymentMethod: 'momo',
    finalTotal: 439000,
    bookedAt: '10/09/2026 10:15',
    qrData: 'CINEGLOW:CG-918234:st-dune-01:F-06,F-07',
  },
];

