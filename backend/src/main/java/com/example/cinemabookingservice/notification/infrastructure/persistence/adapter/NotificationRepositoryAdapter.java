package com.example.cinemabookingservice.notification.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.notification.domain.Notification;
import com.example.cinemabookingservice.notification.domain.repository.NotificationRepository;
import com.example.cinemabookingservice.notification.infrastructure.persistence.entity.NotificationEntity;
import com.example.cinemabookingservice.notification.infrastructure.persistence.mapper.NotificationEntityMapper;
import com.example.cinemabookingservice.notification.infrastructure.persistence.repository.SpringDataNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NotificationRepositoryAdapter implements NotificationRepository {

    private final SpringDataNotificationRepository springRepo;
    private final NotificationEntityMapper mapper;

    @Override
    public Notification save(Notification notification) {
        NotificationEntity entity = mapper.toEntity(notification);
        NotificationEntity saved = springRepo.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return springRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId) {
        return springRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public long countByUserIdAndIsReadFalse(Long userId) {
        return springRepo.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public void saveAll(List<Notification> notifications) {
        List<NotificationEntity> entities = notifications.stream()
                .map(mapper::toEntity)
                .toList();
        springRepo.saveAll(entities);
    }
}