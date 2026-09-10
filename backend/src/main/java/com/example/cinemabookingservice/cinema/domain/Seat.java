package com.example.cinemabookingservice.cinema.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    private Long id;
    private Long roomId;
    private String rowLabel;
    private Integer seatNumber;
    private SeatType seatType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getSeatCode() {
        return rowLabel + seatNumber;
    }
}