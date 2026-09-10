package com.example.cinemabookingservice.cinema.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.RoomEntity;
import org.springframework.stereotype.Component;

@Component
public class RoomEntityMapper {

    public Room toDomain(RoomEntity entity) {
        if (entity == null) return null;
        return Room.builder()
                .id(entity.getId())
                .cinemaId(entity.getCinemaId())
                .name(entity.getName())
                .totalRows(entity.getTotalRows())
                .totalColumns(entity.getTotalColumns())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public RoomEntity toEntity(Room domain) {
        if (domain == null) return null;
        return RoomEntity.builder()
                .id(domain.getId())
                .cinemaId(domain.getCinemaId())
                .name(domain.getName())
                .totalRows(domain.getTotalRows())
                .totalColumns(domain.getTotalColumns())
                .isActive(domain.getIsActive())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}