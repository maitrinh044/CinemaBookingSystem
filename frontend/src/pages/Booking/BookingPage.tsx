import React, { useState, useMemo, useCallback } from 'react';
import type { Movie, CinemaBranch, ShowtimeSlot } from '../../types/movie';
import type { 
  Seat, 
  ConcessionItem, 
  SelectedConcession, 
  CustomerInfo, 
  PaymentMethod 
} from '../../types/booking';
import type { BookingStep } from '../../components/booking/BookingStepsBar';
import { BookingStepsBar } from '../../components/booking/BookingStepsBar';
import { SeatMap } from '../../components/seat/SeatMap';
import { ConcessionsStep } from '../../components/booking/ConcessionsStep';
import { CheckoutStep } from '../../components/booking/CheckoutStep';
import { OrderSummaryCard } from '../../components/booking/OrderSummaryCard';
import { generateSeatsForShowtime } from '../../data/mockBookingData';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Clock } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export interface BookingPageProps {
  movie: Movie;
  cinema: CinemaBranch;
  date: string;
  showtime: ShowtimeSlot;
  onBack: () => void;
  onBookingSuccess: (bookingData: {
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
  }) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  movie,
  cinema,
  date,
  showtime,
  onBack,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Current active step
  const [currentStep, setCurrentStep] = useState<BookingStep>('seat');

  // Generated seat matrix for this showtime
  const [seats] = useState<Seat[]>(() =>
    generateSeatsForShowtime(showtime.id, showtime.price)
  );

  // User selections
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedConcessions, setSelectedConcessions] = useState<SelectedConcession[]>([]);

  // Customer form info prefilled from logged-in user if available
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  // Voucher
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');

  // Timeout state
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

  // Toggle Seat selection with max 8 seats & couple seat pairing rule
  const handleToggleSeat = useCallback((clickedSeat: Seat) => {
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some((s) => s.id === clickedSeat.id);

      if (isAlreadySelected) {
        // Deselect
        if (clickedSeat.type === 'couple') {
          // Deselect couple partner too
          const partnerCol = clickedSeat.col % 2 === 1 ? clickedSeat.col + 1 : clickedSeat.col - 1;
          const partnerId = `${clickedSeat.row}-${partnerCol.toString().padStart(2, '0')}`;
          return prev.filter((s) => s.id !== clickedSeat.id && s.id !== partnerId);
        }
        return prev.filter((s) => s.id !== clickedSeat.id);
      }

      // Check max seat limit (max 8)
      const seatsToAddCount = clickedSeat.type === 'couple' ? 2 : 1;
      if (prev.length + seatsToAddCount > 8) {
        toast.warning('Giới hạn chọn ghế', 'Bạn chỉ có thể chọn tối đa 8 ghế cho một lần đặt vé!');
        return prev;
      }

      // Select seat
      if (clickedSeat.type === 'couple') {
        // Find couple partner
        const partnerCol = clickedSeat.col % 2 === 1 ? clickedSeat.col + 1 : clickedSeat.col - 1;
        const partnerId = `${clickedSeat.row}-${partnerCol.toString().padStart(2, '0')}`;
        const partnerSeat = seats.find((s) => s.id === partnerId);
        if (partnerSeat && partnerSeat.status !== 'sold') {
          return [...prev, clickedSeat, partnerSeat];
        }
      }

      return [...prev, clickedSeat];
    });
  }, [seats, toast]);

  // Update concession quantity (+ / -)
  const handleUpdateConcession = useCallback((item: ConcessionItem, delta: number) => {
    setSelectedConcessions((prev) => {
      const existing = prev.find((sc) => sc.item.id === item.id);
      if (!existing) {
        if (delta > 0) {
          return [...prev, { item, quantity: delta }];
        }
        return prev;
      }

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((sc) => sc.item.id !== item.id);
      }

      return prev.map((sc) =>
        sc.item.id === item.id ? { ...sc, quantity: newQty } : sc
      );
    });
  }, []);

  // Voucher apply logic
  const handleApplyVoucher = (code: string) => {
    if (code === 'CINEVIP') {
      setVoucherCode(code);
      setDiscountAmount(20000);
      const res = { success: true, message: 'Áp dụng thành công voucher VIP giảm 20.000đ', discount: 20000 };
      toast.success('Áp dụng voucher thành công!', res.message);
      return res;
    }
    if (code === 'GIAM20K') {
      setVoucherCode(code);
      setDiscountAmount(20000);
      const res = { success: true, message: 'Áp dụng mã GIAM20K giảm 20.000đ', discount: 20000 };
      toast.success('Áp dụng voucher thành công!', res.message);
      return res;
    }
    if (code === 'DISCOUNT50') {
      setVoucherCode(code);
      setDiscountAmount(50000);
      const res = { success: true, message: 'Áp dụng mã DISCOUNT50 giảm 50.000đ', discount: 50000 };
      toast.success('Áp dụng voucher thành công!', res.message);
      return res;
    }
    const res = { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn', discount: 0 };
    toast.error('Voucher không hợp lệ', res.message);
    return res;
  };

  // Form validity for Checkout step
  const isFormValid = useMemo(() => {
    return (
      customerInfo.fullName.trim().length >= 2 &&
      customerInfo.phone.trim().length >= 9 &&
      customerInfo.email.includes('@')
    );
  }, [customerInfo]);

  // Timeout handler
  const handleTimeout = () => {
    setIsTimeoutModalOpen(true);
    toast.error('Hết thời gian giữ vé!', 'Đã hết 5 phút giữ ghế tạm thời, ghế đã được hoàn trả về hệ thống.');
  };

  const handleResetSeats = () => {
    setSelectedSeats([]);
    setSelectedConcessions([]);
    setCurrentStep('seat');
    setIsTimeoutModalOpen(false);
  };

  // Step navigation
  const handleNextStep = () => {
    if (currentStep === 'seat' && selectedSeats.length > 0) {
      setCurrentStep('concession');
      toast.booking(
        'Đã giữ ghế thành công!',
        `Đã giữ ${selectedSeats.length} ghế (${selectedSeats.map((s) => s.id).join(', ')}) trong 5 phút. Hãy chọn thêm bắp nước nhé!`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'concession') {
      setCurrentStep('checkout');
      toast.info('Chuyển sang thanh toán', 'Vui lòng kiểm tra lại thông tin vé và chọn phương thức thanh toán.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'checkout') {
      if (!isFormValid) {
        toast.warning(
          'Thông tin chưa đầy đủ',
          'Vui lòng điền họ tên, số điện thoại (tối thiểu 9 số) và email hợp lệ để nhận vé.'
        );
        return;
      }

      // Complete booking!
      const seatsTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
      const concessionsTotal = selectedConcessions.reduce(
        (acc, sc) => acc + sc.item.price * sc.quantity,
        0
      );
      const finalTotal = Math.max(0, seatsTotal + concessionsTotal - discountAmount);
      const bookingCode = `CG-${Math.floor(100000 + Math.random() * 900000)}`;

      onBookingSuccess({
        movie,
        cinema,
        date,
        showtime,
        seats: selectedSeats,
        concessions: selectedConcessions,
        customerInfo,
        paymentMethod,
        finalTotal,
        bookingCode,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'checkout') {
      setCurrentStep('concession');
    } else if (currentStep === 'concession') {
      setCurrentStep('seat');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6">

      {/* Top 3-Step Progress Bar with 5-Minute Timer */}
      <BookingStepsBar
        currentStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        canGoToConcession={selectedSeats.length > 0}
        canGoToCheckout={selectedSeats.length > 0}
        onTimeout={handleTimeout}
      />

      {/* Main 2-Column Grid: Workspace (8 cols) & Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Step Content */}
        <div className="lg:col-span-8 space-y-6">
          {currentStep === 'seat' && (
            <div className="glass-panel p-3 sm:p-4 lg:p-6 rounded-2xl border border-[var(--border-color)] shadow-xl">
              <SeatMap
                seats={seats}
                selectedSeats={selectedSeats}
                onToggleSeat={handleToggleSeat}
                hallName={showtime.hallName}
              />
            </div>
          )}

          {currentStep === 'concession' && (
            <ConcessionsStep
              selectedConcessions={selectedConcessions}
              onUpdateQuantity={handleUpdateConcession}
            />
          )}

          {currentStep === 'checkout' && (
            <CheckoutStep
              customerInfo={customerInfo}
              onUpdateCustomerInfo={(patch) =>
                setCustomerInfo((prev) => ({ ...prev, ...patch }))
              }
              voucherCode={voucherCode}
              discountAmount={discountAmount}
              onApplyVoucher={handleApplyVoucher}
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
            />
          )}
        </div>

        {/* Right Column: Sticky Live Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <OrderSummaryCard
            movie={movie}
            cinema={cinema}
            date={date}
            showtime={showtime}
            selectedSeats={selectedSeats}
            selectedConcessions={selectedConcessions}
            discountAmount={discountAmount}
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onCancelBooking={onBack}
            isFormValid={isFormValid}
          />
        </div>
      </div>

      {/* 5-Minute Hold Timeout Modal */}
      <Modal
        isOpen={isTimeoutModalOpen}
        onClose={handleResetSeats}
        title="Đã Hết Thời Gian Giữ Vé"
        size="sm"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <p className="text-xs text-[var(--text-sub)] leading-relaxed">
            Đã hết 5 phút giữ ghế tạm thời. Để đảm bảo tính công bằng cho các khách hàng khác, các ghế đã chọn đã được hoàn trả về hệ thống.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={handleResetSeats}
            className="w-full"
          >
            Bấm để chọn lại ghế
          </Button>
        </div>
      </Modal>
    </div>
  );
};
