package com.example.cinemabookingservice.movie.application.dto.genre;

import java.time.LocalDateTime;

public record GenreResponse(
        Long id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}