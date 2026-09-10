package com.example.cinemabookingservice.booking.application.dto;

import com.example.cinemabookingservice.booking.domain.TicketStatus;
import com.example.cinemabookingservice.cinema.domain.SeatType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    private Long id;
    private String ticketCode;
    private Long bookingSeatId;
    private Long seatId;
    private String seatCode;
    private SeatType seatType;
    private String qrCode;
    private TicketStatus status;
    private LocalDateTime checkedInAt;
    private LocalDateTime createdAt;
}