package com.example.cinemabookingservice.notification.domain.repository;

import com.example.cinemabookingservice.notification.domain.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository {
    Notification save(Notification notification);
    Optional<Notification> findById(Long id);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
    void saveAll(List<Notification> notifications);
}