package com.example.cinemabookingservice.showtime.domain;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSeatPrice {
    private Long id;
    private Long showtimeId;
    private SeatType seatType;
    private BigDecimal price;
}