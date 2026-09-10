package com.example.cinemabookingservice.booking.infrastructure.scheduler;

import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingStatus;
import com.example.cinemabookingservice.booking.domain.repository.BookingRepository;
import com.example.cinemabookingservice.booking.domain.repository.BookingSeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExpiredBookingCleanupScheduler {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @Scheduled(fixedDelay = 30000)
    @Transactional
    public void cleanupExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository.findExpiredBookings(BookingStatus.PENDING, now);

        if (!expiredBookings.isEmpty()) {
            log.info("Phát hiện {} đơn giữ ghế đã hết hạn, tiến hành giải phóng ghế...", expiredBookings.size());

            for (Booking booking : expiredBookings) {
                // Giải phóng các ghế bị khóa để người dùng khác có thể chọn
                bookingSeatRepository.deleteByBookingId(booking.getId());

                booking.setStatus(BookingStatus.EXPIRED);
                booking.setUpdatedAt(now);
                bookingRepository.save(booking);

                log.info("Đã hủy và giải phóng ghế cho đơn đặt vé hết hạn: {}", booking.getBookingCode());
            }
        }
    }
}