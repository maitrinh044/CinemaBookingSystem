package com.example.cinemabookingservice.showtime.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.entity.ShowtimeSeatPriceEntity;
import org.springframework.stereotype.Component;

@Component
public class ShowtimeSeatPriceEntityMapper {

    public ShowtimeSeatPrice toDomain(ShowtimeSeatPriceEntity entity) {
        if (entity == null) return null;
        return ShowtimeSeatPrice.builder()
                .id(entity.getId())
                .showtimeId(entity.getShowtimeId())
                .seatType(entity.getSeatType())
                .price(entity.getPrice())
                .build();
    }

    public ShowtimeSeatPriceEntity toEntity(ShowtimeSeatPrice domain) {
        if (domain == null) return null;
        return ShowtimeSeatPriceEntity.builder()
                .id(domain.getId())
                .showtimeId(domain.getShowtimeId())
                .seatType(domain.getSeatType())
                .price(domain.getPrice())
                .build();
    }
}