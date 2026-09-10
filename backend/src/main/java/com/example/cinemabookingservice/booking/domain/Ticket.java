package com.example.cinemabookingservice.booking.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    private Long id;
    private String ticketCode;
    private Long bookingSeatId;
    private String qrCode;
    private TicketStatus status;
    private LocalDateTime checkedInAt;
    private LocalDateTime createdAt;

    public boolean isValidForCheckIn() {
        return status == TicketStatus.UNUSED;
    }
}