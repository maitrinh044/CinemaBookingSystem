package com.example.cinemabookingservice.showtime.application.dto;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSeatPriceDto {
    private SeatType seatType;
    private BigDecimal price;

    public static ShowtimeSeatPriceDto fromDomain(ShowtimeSeatPrice price) {
        if (price == null) return null;
        return ShowtimeSeatPriceDto.builder()
                .seatType(price.getSeatType())
                .price(price.getPrice())
                .build();
    }
}