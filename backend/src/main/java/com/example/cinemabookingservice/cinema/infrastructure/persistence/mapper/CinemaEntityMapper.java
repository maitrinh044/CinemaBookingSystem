package com.example.cinemabookingservice.cinema.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.CinemaEntity;
import org.springframework.stereotype.Component;

@Component
public class CinemaEntityMapper {

    public Cinema toDomain(CinemaEntity entity) {
        if (entity == null) return null;
        return Cinema.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .city(entity.getCity())
                .district(entity.getDistrict())
                .phone(entity.getPhone())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public CinemaEntity toEntity(Cinema domain) {
        if (domain == null) return null;
        return CinemaEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .address(domain.getAddress())
                .city(domain.getCity())
                .district(domain.getDistrict())
                .phone(domain.getPhone())
                .isActive(domain.getIsActive())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}