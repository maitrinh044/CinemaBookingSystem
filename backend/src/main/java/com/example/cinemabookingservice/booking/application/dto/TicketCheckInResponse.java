package com.example.cinemabookingservice.booking.application.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCheckInResponse {
    private Boolean success;
    private String message;
    private String ticketCode;
    private String seatCode;
    private String movieTitle;
    private String roomName;
    private String cinemaName;
    private LocalDateTime startTime;
    private LocalDateTime checkedInAt;
}