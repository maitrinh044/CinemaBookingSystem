package com.example.cinemabookingservice.notification.application.service;

import com.example.cinemabookingservice.notification.application.dto.NotificationResponse;
import com.example.cinemabookingservice.notification.domain.Notification;
import com.example.cinemabookingservice.notification.domain.exception.NotificationNotFoundException;
import com.example.cinemabookingservice.notification.domain.repository.NotificationRepository;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.exception.UserNotFoundException;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Notification createNotification(Long userId, String title, String content) {
        Notification notification = Notification.builder()
                .userId(userId)
                .title(title)
                .content(content)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationResponse markAsRead(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Không tìm thấy thông báo ID: " + id));

        if (!notification.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("Bạn không có quyền chỉnh sửa thông báo này");
        }

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        Notification updated = notificationRepository.save(notification);
        return mapToResponse(updated);
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        List<Notification> unreadList = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .filter(n -> !n.isRead())
                .toList();

        LocalDateTime now = LocalDateTime.now();
        for (Notification n : unreadList) {
            n.setRead(true);
            n.setReadAt(now);
        }

        notificationRepository.saveAll(unreadList);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .readAt(n.getReadAt())
                .build();
    }
}