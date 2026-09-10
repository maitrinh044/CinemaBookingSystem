package com.example.cinemabookingservice.booking.application.dto;

import com.example.cinemabookingservice.booking.domain.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private String bookingCode;
    private Long userId;
    private Long showtimeId;
    private String movieTitle;
    private String moviePosterUrl;
    private String roomName;
    private String cinemaName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private List<BookingSeatDto> seats;
    private List<TicketResponse> tickets;
}