package com.example.cinemabookingservice.booking.domain;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {
    private Long id;
    private Long bookingId;
    private Long showtimeId;
    private Long seatId;
    private BigDecimal price;
    private LocalDateTime createdAt;
}