import type { Movie, CinemaBranch, ShowtimeSlot } from '../types/movie';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'dune-2',
    title: 'Dune: Hành Tinh Cát - Phần Hai',
    originalTitle: 'Dune: Part Two',
    poster: '/src/assets/posters/dune2.jpg',
    backdrop: '/src/assets/backdrops/dune2.jpg',
    duration: 166,
    releaseDate: '2026-03-01',
    ageRating: 'T16',
    formats: ['IMAX', '2D', 'GOLD CLASS'],
    rating: 8.8,
    voteCount: 14250,
    genres: ['Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
    synopsis: 'Hành trình tiếp theo của Paul Atreides khi anh hợp nhất cùng Chani và tộc người Fremen để trả thù những kẻ đã hủy hoại gia tộc của mình.',
    status: 'now_showing',
    isHot: true,
  },
  {
    id: 'godzilla-kong-2',
    title: 'Godzilla x Kong: Đế Chế Mới',
    originalTitle: 'Godzilla x Kong: The New Empire',
    poster: '/src/assets/posters/godzilla_kong.jpg',
    backdrop: '/src/assets/backdrops/godzilla_kong.jpg',
    duration: 115,
    releaseDate: '2026-03-29',
    ageRating: 'T13',
    formats: ['IMAX', '4DX', '3D', '2D'],
    rating: 7.6,
    voteCount: 8930,
    genres: ['Hành Động', 'Khoa Học Viễn Tưởng', 'Quái Thú'],
    director: 'Adam Wingard',
    cast: ['Rebecca Hall', 'Brian Tyree Henry', 'Dan Stevens'],
    trailerUrl: 'https://www.youtube.com/embed/lV1OOlGwExg?autoplay=1',
    synopsis: 'Hai quái thú huyền thoại Godzilla và Kong buộc phải bắt tay chống lại mối hiểm họa khổng lồ ẩn sâu bên trong Trái Đất Rỗng đe dọa sự tồn vong của loài người.',
    status: 'now_showing',
    isHot: true,
  },
  {
    id: 'kung-fu-panda-4',
    title: 'Kung Fu Panda 4',
    originalTitle: 'Kung Fu Panda 4',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1563201515-adbe35e2f0c2?w=1600&auto=format&fit=crop&q=80',
    duration: 94,
    releaseDate: '2026-03-08',
    ageRating: 'P',
    formats: ['2D', '3D'],
    rating: 7.9,
    voteCount: 6540,
    genres: ['Hoạt Hình', 'Hài Hước', 'Võ Thuật', 'Gia Đình'],
    director: 'Mike Mitchell',
    cast: ['Jack Black', 'Awkwafina', 'Viola Davis', 'Dustin Hoffman'],
    trailerUrl: 'https://www.youtube.com/embed/_inKs4eeHiI?autoplay=1',
    synopsis: 'Sau nhiều năm chiến đấu, Po chuẩn bị trở thành Thủ lĩnh Tinh thần của Thung lũng Bình Yên và phải tìm kiếm một Thần Long Đại Hiệp kế vị mới.',
    status: 'now_showing',
    isHot: false,
  },
  {
    id: 'mai',
    title: 'Mai',
    originalTitle: 'Mai',
    poster: '/src/assets/posters/mai.jpg',
    backdrop: '/src/assets/backdrops/mai.jpg',
    duration: 131,
    releaseDate: '2026-02-10',
    ageRating: 'T18',
    formats: ['2D', 'VIP'],
    rating: 8.2,
    voteCount: 22100,
    genres: ['Tâm Lý', 'Tình Cảm', 'Chính Kịch'],
    director: 'Trấn Thành',
    cast: ['Phương Anh Đào', 'Tuấn Trần', 'Hồng Đào', 'Trấn Thành'],
    trailerUrl: 'https://www.youtube.com/embed/qft_W_sI4hI?autoplay=1',
    synopsis: 'Câu chuyện tình yêu day dứt và nhiều định kiến giữa cô gái mát-xa tên Mai và anh chàng nhà giàu Dương với khát khao tìm kiếm hạnh phúc đích thực.',
    status: 'now_showing',
    isHot: true,
  },
  {
    id: 'deadpool-wolverine',
    title: 'Deadpool & Wolverine',
    originalTitle: 'Deadpool & Wolverine',
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    duration: 128,
    releaseDate: '2026-07-26',
    ageRating: 'T18',
    formats: ['IMAX', '4DX', '2D'],
    rating: 8.5,
    voteCount: 31000,
    genres: ['Hành Động', 'Hài Hước', 'Siêu Anh Hùng'],
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk?autoplay=1',
    synopsis: 'Cặp đôi siêu anh hùng lầy lội nhất vũ trụ Marvel tái hợp trong chuyến phiêu lưu giải cứu đa vũ trụ đẫm máu nhưng không kém phần hài hước.',
    status: 'coming_soon',
    isHot: true,
  },
  {
    id: 'oppenheimer-re',
    title: 'Oppenheimer (Chiếu Lại IMAX)',
    originalTitle: 'Oppenheimer: The IMAX Experience',
    poster: '/src/assets/posters/oppenheimer.jpg',
    backdrop: '/src/assets/backdrops/oppenheimer.jpg',
    duration: 180,
    releaseDate: '2026-04-12',
    ageRating: 'T18',
    formats: ['IMAX', 'GOLD CLASS'],
    rating: 8.9,
    voteCount: 45000,
    genres: ['Tiểu Sử', 'Lịch Sử', 'Chính Kịch'],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg?autoplay=1',
    synopsis: 'Tác phẩm đoạt 7 giải Oscar của Christopher Nolan kể về cuộc đời và thử nghiệm bom nguyên tử của nhà vật lý J. Robert Oppenheimer.',
    status: 'special_sneak',
    isHot: true,
  },
  {
    id: 'joker-2',
    title: 'Joker: Điên Có Đôi',
    originalTitle: 'Joker: Folie à Deux',
    poster: '/src/assets/posters/joker2.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/tnAuB8sAznzbS3oEDuXmQleoCKc.jpg',
    duration: 138,
    releaseDate: '2026-10-04',
    ageRating: 'T18',
    formats: ['IMAX', '2D'],
    rating: 8.0,
    voteCount: 15800,
    genres: ['Tâm Lý', 'Tội Phạm', 'Âm Nhạc'],
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Lady Gaga', 'Zazie Beetz'],
    trailerUrl: 'https://www.youtube.com/embed/_OKAwz2NiOI?autoplay=1',
    synopsis: 'Arthur Fleck bị giam giữ tại bệnh viện tâm thần Arkham và gặp được tình yêu điên loạn của đời mình: Harley Quinn.',
    status: 'coming_soon',
    isHot: false,
  },
  {
    id: 'despicable-me-4',
    title: 'Kẻ Trộm Mặt Trăng 4',
    originalTitle: 'Despicable Me 4',
    poster: 'https://images.unsplash.com/photo-1620428268482-cf1851a36764?w=600&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1600&auto=format&fit=crop&q=80',
    duration: 95,
    releaseDate: '2026-07-05',
    ageRating: 'P',
    formats: ['2D', '3D', '4DX'],
    rating: 7.4,
    voteCount: 9200,
    genres: ['Hoạt Hình', 'Hài Hước', 'Gia Đình'],
    director: 'Chris Renaud',
    cast: ['Steve Carell', 'Kristen Wiig', 'Will Ferrell'],
    trailerUrl: 'https://www.youtube.com/embed/qQlr9-rF32E?autoplay=1',
    synopsis: 'Gru cùng gia đình và đội quân Minions tinh quái đối đầu với kẻ thù mới nguy hiểm Maxime Le Mal cùng bạn gái quyến rũ Valentina.',
    status: 'coming_soon',
    isHot: false,
  },
];

export const MOCK_CINEMAS: CinemaBranch[] = [
  {
    id: 'cineglow-l81',
    name: 'CineGlow Landmark 81 IMAX Laser',
    address: 'Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, Q. Bình Thạnh',
    cityId: 'hcm',
    cityName: 'TP. Hồ Chí Minh',
    formats: ['IMAX', 'GOLD CLASS', '2D', '3D'],
  },
  {
    id: 'cineglow-dongkhoi',
    name: 'CineGlow Vincom Center Đồng Khởi',
    address: 'Tầng 3, TTTM Vincom Đồng Khởi, 72 Lê Thánh Tôn, Q.1',
    cityId: 'hcm',
    cityName: 'TP. Hồ Chí Minh',
    formats: ['4DX', 'GOLD CLASS', '2D'],
  },
  {
    id: 'cineglow-royalcity',
    name: 'CineGlow Royal City MegaMall',
    address: 'Tầng B2, TTTM Vincom Mega Mall Royal City, 72A Nguyễn Trãi, Q. Thanh Xuân',
    cityId: 'hn',
    cityName: 'Hà Nội',
    formats: ['IMAX', '4DX', '2D', '3D'],
  },
  {
    id: 'cineglow-lieugiai',
    name: 'CineGlow Metropolis Liễu Giai',
    address: 'Tầng 3, Vincom Center Metropolis, 29 Liễu Giai, Q. Ba Đình',
    cityId: 'hn',
    cityName: 'Hà Nội',
    formats: ['GOLD CLASS', '2D', 'VIP'],
  },
  {
    id: 'cineglow-danang',
    name: 'CineGlow Đà Nẵng Riverside',
    address: 'Tầng 4, TTTM Vincom Plaza Ngô Quyền, Q. Sơn Trà',
    cityId: 'dn',
    cityName: 'Đà Nẵng',
    formats: ['IMAX', '2D', '3D'],
  },
];

// Available Dates for Booking (Hôm nay + 6 ngày tiếp theo)
export const getUpcomingDates = () => {
  const dates = [];
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = i === 0 ? 'Hôm Nay' : i === 1 ? 'Ngày Mai' : daysOfWeek[d.getDay()];
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const isoDate = d.toISOString().split('T')[0];
    dates.push({
      dateStr: isoDate,
      label: dayName,
      subLabel: dateFormatted,
    });
  }
  return dates;
};

export const MOCK_SHOWTIMES: ShowtimeSlot[] = [
  {
    id: 'st-1',
    movieId: 'dune-2',
    cinemaId: 'cineglow-l81',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    format: 'IMAX',
    hallName: 'IMAX Laser Hall 1',
    price: 180000,
    availableSeats: 64,
    totalSeats: 120,
  },
  {
    id: 'st-2',
    movieId: 'dune-2',
    cinemaId: 'cineglow-l81',
    date: new Date().toISOString().split('T')[0],
    time: '13:15',
    format: 'IMAX',
    hallName: 'IMAX Laser Hall 1',
    price: 210000,
    availableSeats: 28,
    totalSeats: 120,
  },
  {
    id: 'st-3',
    movieId: 'dune-2',
    cinemaId: 'cineglow-l81',
    date: new Date().toISOString().split('T')[0],
    time: '17:00',
    format: 'IMAX',
    hallName: 'IMAX Laser Hall 1',
    price: 230000,
    availableSeats: 12,
    totalSeats: 120,
  },
  {
    id: 'st-4',
    movieId: 'dune-2',
    cinemaId: 'cineglow-l81',
    date: new Date().toISOString().split('T')[0],
    time: '20:45',
    format: 'IMAX',
    hallName: 'IMAX Laser Hall 1',
    price: 230000,
    availableSeats: 8,
    totalSeats: 120,
  },
  {
    id: 'st-5',
    movieId: 'godzilla-kong-2',
    cinemaId: 'cineglow-l81',
    date: new Date().toISOString().split('T')[0],
    time: '10:15',
    format: '4DX',
    hallName: '4DX Hall 2',
    price: 190000,
    availableSeats: 42,
    totalSeats: 90,
  },
  {
    id: 'st-6',
    movieId: 'godzilla-kong-2',
    cinemaId: 'cineglow-l81',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    format: '4DX',
    hallName: '4DX Hall 2',
    price: 220000,
    availableSeats: 18,
    totalSeats: 90,
  },
  {
    id: 'st-7',
    movieId: 'mai',
    cinemaId: 'cineglow-dongkhoi',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    format: 'VIP',
    hallName: 'Cinema 3 VIP',
    price: 140000,
    availableSeats: 35,
    totalSeats: 80,
  },
];

export interface CinemaShowtimeGroup {
  cinema: CinemaBranch;
  formatGroups: {
    format: string;
    slots: ShowtimeSlot[];
  }[];
}

export const getMovieShowtimesGrouped = (movieId: string, dateStr: string, cityId?: string): CinemaShowtimeGroup[] => {
  let cinemas = MOCK_CINEMAS;
  if (cityId) {
    cinemas = cinemas.filter((c) => c.cityId === cityId);
  }

  // Pre-configured time schedules
  const standardSchedules = [
    { time: '09:15', format: '2D' as const, hall: 'Cinema 1', price: 95000, seats: 52 },
    { time: '11:45', format: '2D' as const, hall: 'Cinema 1', price: 105000, seats: 34 },
    { time: '14:20', format: '2D' as const, hall: 'Cinema 2', price: 105000, seats: 16 },
    { time: '17:00', format: '2D' as const, hall: 'Cinema 1', price: 120000, seats: 8 },
    { time: '19:40', format: '2D' as const, hall: 'Cinema 2', price: 125000, seats: 22 },
    { time: '22:15', format: '2D' as const, hall: 'Cinema 1', price: 95000, seats: 60 },
  ];

  const imaxSchedules = [
    { time: '10:00', format: 'IMAX' as const, hall: 'IMAX Laser Hall 1', price: 180000, seats: 45 },
    { time: '13:30', format: 'IMAX' as const, hall: 'IMAX Laser Hall 1', price: 210000, seats: 28 },
    { time: '17:15', format: 'IMAX' as const, hall: 'IMAX Laser Hall 1', price: 230000, seats: 12 },
    { time: '20:50', format: 'IMAX' as const, hall: 'IMAX Laser Hall 1', price: 230000, seats: 6 },
  ];

  const vipSchedules = [
    { time: '12:00', format: 'GOLD CLASS' as const, hall: 'Gold Lounge 1', price: 280000, seats: 14 },
    { time: '16:00', format: 'GOLD CLASS' as const, hall: 'Gold Lounge 1', price: 320000, seats: 10 },
    { time: '20:00', format: 'GOLD CLASS' as const, hall: 'Gold Lounge 1', price: 320000, seats: 4 },
  ];

  const results: CinemaShowtimeGroup[] = [];

  cinemas.forEach((cinema) => {
    const formatGroups: { format: string; slots: ShowtimeSlot[] }[] = [];

    // Check if cinema supports IMAX
    if (cinema.formats.includes('IMAX')) {
      formatGroups.push({
        format: 'IMAX Laser (Màn Hình Cong 3D/2D Siêu Sáng)',
        slots: imaxSchedules.map((s, idx) => ({
          id: `${cinema.id}-${movieId}-${dateStr}-imax-${idx}`,
          movieId,
          cinemaId: cinema.id,
          date: dateStr,
          time: s.time,
          format: s.format,
          hallName: s.hall,
          price: s.price,
          availableSeats: s.seats,
          totalSeats: 120,
        })),
      });
    }

    // Standard 2D
    formatGroups.push({
      format: '2D Kỹ Thuật Số (Phụ Đề Tiếng Việt)',
      slots: standardSchedules.map((s, idx) => ({
        id: `${cinema.id}-${movieId}-${dateStr}-2d-${idx}`,
        movieId,
        cinemaId: cinema.id,
        date: dateStr,
        time: s.time,
        format: s.format,
        hallName: s.hall,
        price: s.price,
        availableSeats: s.seats,
        totalSeats: 100,
      })),
    });

    // Check if cinema supports Gold Class / VIP
    if (cinema.formats.includes('GOLD CLASS') || cinema.formats.includes('VIP')) {
      formatGroups.push({
        format: 'VIP Gold Class (Ghế Sofa Điện & Phục Vụ Riêng)',
        slots: vipSchedules.map((s, idx) => ({
          id: `${cinema.id}-${movieId}-${dateStr}-vip-${idx}`,
          movieId,
          cinemaId: cinema.id,
          date: dateStr,
          time: s.time,
          format: s.format,
          hallName: s.hall,
          price: s.price,
          availableSeats: s.seats,
          totalSeats: 30,
        })),
      });
    }

    results.push({
      cinema,
      formatGroups,
    });
  });

  return results;
};

