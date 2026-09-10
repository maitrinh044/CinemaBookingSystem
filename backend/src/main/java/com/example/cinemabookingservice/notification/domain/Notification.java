package com.example.cinemabookingservice.notification.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}