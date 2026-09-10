package com.example.cinemabookingservice.showtime.application.dto;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSeatItemDto {
    private Long seatId;
    private String rowLabel;
    private Integer seatNumber;
    private String seatCode;
    private SeatType seatType;
    private BigDecimal price;
    // AVAILABLE, HOLDING, SOLD
    @Builder.Default
    private String status = "AVAILABLE";
}