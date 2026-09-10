package com.example.cinemabookingservice.notification.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.notification.domain.Notification;
import com.example.cinemabookingservice.notification.infrastructure.persistence.entity.NotificationEntity;
import org.springframework.stereotype.Component;

@Component
public class NotificationEntityMapper {

    public Notification toDomain(NotificationEntity entity) {
        if (entity == null) return null;
        return Notification.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .isRead(Boolean.TRUE.equals(entity.getIsRead()))
                .createdAt(entity.getCreatedAt())
                .readAt(entity.getReadAt())
                .build();
    }

    public NotificationEntity toEntity(Notification domain) {
        if (domain == null) return null;
        return NotificationEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .title(domain.getTitle())
                .content(domain.getContent())
                .isRead(domain.isRead())
                .createdAt(domain.getCreatedAt())
                .readAt(domain.getReadAt())
                .build();
    }
}