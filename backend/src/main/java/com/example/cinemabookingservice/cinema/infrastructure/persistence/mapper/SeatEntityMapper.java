package com.example.cinemabookingservice.cinema.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.SeatEntity;
import org.springframework.stereotype.Component;

@Component
public class SeatEntityMapper {

    public Seat toDomain(SeatEntity entity) {
        if (entity == null) return null;
        return Seat.builder()
                .id(entity.getId())
                .roomId(entity.getRoomId())
                .rowLabel(entity.getRowLabel())
                .seatNumber(entity.getSeatNumber())
                .seatType(entity.getSeatType())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public SeatEntity toEntity(Seat domain) {
        if (domain == null) return null;
        return SeatEntity.builder()
                .id(domain.getId())
                .roomId(domain.getRoomId())
                .rowLabel(domain.getRowLabel())
                .seatNumber(domain.getSeatNumber())
                .seatType(domain.getSeatType())
                .isActive(domain.getIsActive())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}