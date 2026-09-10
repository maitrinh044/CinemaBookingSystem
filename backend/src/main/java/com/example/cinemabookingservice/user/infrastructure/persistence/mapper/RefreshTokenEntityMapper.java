package com.example.cinemabookingservice.user.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.user.domain.RefreshToken;
import com.example.cinemabookingservice.user.infrastructure.persistence.entity.RefreshTokenEntity;
import org.springframework.stereotype.Component;

@Component
public class RefreshTokenEntityMapper {

    public RefreshToken toDomain(RefreshTokenEntity entity) {
        if (entity == null) return null;
        return RefreshToken.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .token(entity.getToken())
                .expiresAt(entity.getExpiresAt())
                .revoked(entity.getRevoked())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public RefreshTokenEntity toEntity(RefreshToken domain) {
        if (domain == null) return null;
        return RefreshTokenEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .token(domain.getToken())
                .expiresAt(domain.getExpiresAt())
                .revoked(domain.getRevoked())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
