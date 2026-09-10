package com.example.cinemabookingservice.booking.domain;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    private Long id;
    private String bookingCode;
    private Long userId;
    private Long showtimeId;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;

    public boolean isExpired() {
        return status == BookingStatus.EXPIRED ||
               (status == BookingStatus.PENDING && expiresAt != null && expiresAt.isBefore(LocalDateTime.now()));
    }

    public boolean canBeCancelled() {
        return status == BookingStatus.PENDING;
    }
}