package com.example.cinemabookingservice.movie.application.dto.movie;

import com.example.cinemabookingservice.movie.application.dto.genre.GenreResponse;
import com.example.cinemabookingservice.movie.domain.MovieStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

public record MovieResponse(

        Long id,

        String title,

        String originalTitle,

        String description,

        int durationMinutes,

        LocalDate releaseDate,

        LocalDate endDate,

        String ageRating,

        String director,

        String language,

        String country,

        String posterUrl,

        String bannerUrl,

        String trailerUrl,

        MovieStatus status,

        Set<GenreResponse> genres,

        LocalDateTime createdAt,

        LocalDateTime updatedAt
) {
}