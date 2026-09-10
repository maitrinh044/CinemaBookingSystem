package com.example.cinemabookingservice.booking.application.dto;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeatDto {
    private Long bookingSeatId;
    private Long seatId;
    private String rowLabel;
    private Integer seatNumber;
    private String seatCode;
    private SeatType seatType;
    private BigDecimal price;
}