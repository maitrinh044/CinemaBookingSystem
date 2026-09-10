import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/Home/HomePage';
import { MovieDetailPage } from './pages/MovieDetail/MovieDetailPage';
import { BookingPage } from './pages/Booking/BookingPage';
import { TicketSuccessPage } from './pages/TicketSuccess/TicketSuccessPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { ShowtimesPage } from './pages/Showtimes/ShowtimesPage';
import { MoviesPage } from './pages/Movies/MoviesPage';
import { CinemasPage } from './pages/Cinemas/CinemasPage';
import { ConcessionsPage } from './pages/Concessions/ConcessionsPage';
import { PromotionsPage } from './pages/Promotions/PromotionsPage';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { usePageSEO } from './hooks/usePageSEO';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import type { Movie, CinemaBranch, ShowtimeSlot } from './types/movie';
import type { Seat, SelectedConcession, CustomerInfo, PaymentMethod, CompletedBooking } from './types/booking';

export const App: React.FC = () => {
  const { addBooking } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected movie for detail
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Active booking session
  const [bookingSession, setBookingSession] = useState<{
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  } | null>(null);

  // Completed booking ticket
  const [completedBooking, setCompletedBooking] = useState<CompletedBooking | null>(null);

  // Derive activeTab from URL pathname for Header & navigation indicators
  const activeTab = (() => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/movie')) return 'movies';
    if (path.startsWith('/showtimes')) return 'showtimes';
    if (path.startsWith('/cinemas')) return 'cinemas';
    if (path.startsWith('/concessions')) return 'concessions';
    if (path.startsWith('/promotions')) return 'promotions';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/auth')) return 'auth';
    if (path.startsWith('/booking')) return 'movies';
    if (path.startsWith('/ticket-success')) return 'profile';
    return 'home';
  })();

  // Dynamic SEO Page Title & Meta tags
  usePageSEO(selectedMovie?.title);

  // Scroll to top automatically on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  const handleBackToHome = () => {
    setSelectedMovie(null);
    navigate('/');
  };

  const handleProceedToSeatSelection = (booking: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
  }) => {
    setBookingSession(booking);
    toast.booking(
      'Chọn ghế xem phim',
      `${booking.movie.title} • ${booking.showtime.time} (${booking.showtime.format}) tại ${booking.cinema.name}`
    );
    navigate('/booking');
  };

  const handleBookingSuccess = (orderData: {
    movie: Movie;
    cinema: CinemaBranch;
    date: string;
    showtime: ShowtimeSlot;
    seats: Seat[];
    concessions: SelectedConcession[];
    customerInfo: CustomerInfo;
    paymentMethod: PaymentMethod;
    finalTotal: number;
    bookingCode: string;
  }) => {
    const fullTicket: CompletedBooking = {
      ...orderData,
      bookedAt:
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
        ' ' +
        new Date().toLocaleDateString('vi-VN'),
      qrData: `CINEGLOW:${orderData.bookingCode}:${orderData.showtime.id}:${orderData.seats.map((s) => s.id).join(',')}`,
    };
    addBooking(fullTicket);
    setCompletedBooking(fullTicket);
    setBookingSession(null);

    const paymentMethodNames: Record<PaymentMethod, string> = {
      momo: 'Ví MoMo',
      vnpay: 'VNPAY-QR',
      zalopay: 'Ví ZaloPay',
      card: 'Thẻ Quốc Tế',
    };
    const methodName = paymentMethodNames[orderData.paymentMethod] || 'Ví điện tử';

    toast.payment(
      'Thanh toán thành công!',
      `Đơn hàng ${orderData.bookingCode} đã thanh toán ${orderData.finalTotal.toLocaleString('vi-VN')} đ qua ${methodName}. Vé điện tử đã sẵn sàng!`
    );

    navigate('/ticket-success');
  };

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'movies':
        navigate('/movies');
        break;
      case 'showtimes':
        navigate('/showtimes');
        break;
      case 'cinemas':
        navigate('/cinemas');
        break;
      case 'concessions':
        navigate('/concessions');
        break;
      case 'promotions':
        navigate('/promotions');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'auth':
        navigate('/auth');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onNavigate={handleNavigate}
      onSelectMovie={handleSelectMovie}
    >
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onSelectMovieForBooking={handleSelectMovie}
              onProceedToBooking={handleProceedToSeatSelection}
            />
          }
        />
        <Route
          path="/movies"
          element={<MoviesPage onSelectMovie={handleSelectMovie} />}
        />
        <Route
          path="/movie/:id"
          element={
            <MovieDetailPage
              movie={selectedMovie}
              onBack={handleBackToHome}
              onSelectMovie={handleSelectMovie}
              onProceedToSeatSelection={handleProceedToSeatSelection}
            />
          }
        />
        <Route
          path="/showtimes"
          element={
            <ShowtimesPage
              onSelectMovieForBooking={handleSelectMovie}
              onProceedToBooking={handleProceedToSeatSelection}
            />
          }
        />
        <Route
          path="/cinemas"
          element={<CinemasPage onNavigateToShowtimes={() => handleNavigate('showtimes')} />}
        />
        <Route
          path="/concessions"
          element={<ConcessionsPage onNavigateToBooking={() => handleNavigate('movies')} />}
        />
        <Route
          path="/promotions"
          element={<PromotionsPage onNavigateToBooking={() => handleNavigate('movies')} />}
        />
        <Route
          path="/booking"
          element={
            bookingSession ? (
              <BookingPage
                movie={bookingSession.movie}
                cinema={bookingSession.cinema}
                date={bookingSession.date}
                showtime={bookingSession.showtime}
                onBack={() => navigate(-1)}
                onBookingSuccess={handleBookingSuccess}
              />
            ) : (
              <Navigate to="/movies" replace />
            )
          }
        />
        <Route
          path="/ticket-success"
          element={
            completedBooking ? (
              <TicketSuccessPage
                booking={completedBooking}
                onBackToHome={handleBackToHome}
              />
            ) : (
              <Navigate to="/profile" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage
              onBackToHome={handleBackToHome}
              onBookMore={() => handleNavigate('movies')}
            />
          }
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              initialTab="login"
              onBackToHome={handleBackToHome}
            />
          }
        />
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PwaInstallPrompt />
    </MainLayout>
  );
};

export default App;
