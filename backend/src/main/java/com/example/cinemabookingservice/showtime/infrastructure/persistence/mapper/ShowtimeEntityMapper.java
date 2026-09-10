package com.example.cinemabookingservice.showtime.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.entity.ShowtimeEntity;
import org.springframework.stereotype.Component;

@Component
public class ShowtimeEntityMapper {

    public Showtime toDomain(ShowtimeEntity entity) {
        if (entity == null) return null;
        return Showtime.builder()
                .id(entity.getId())
                .movieId(entity.getMovieId())
                .roomId(entity.getRoomId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .basePrice(entity.getBasePrice())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public ShowtimeEntity toEntity(Showtime domain) {
        if (domain == null) return null;
        return ShowtimeEntity.builder()
                .id(domain.getId())
                .movieId(domain.getMovieId())
                .roomId(domain.getRoomId())
                .startTime(domain.getStartTime())
                .endTime(domain.getEndTime())
                .basePrice(domain.getBasePrice())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}