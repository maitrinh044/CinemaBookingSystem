package com.example.cinemabookingservice.movie.application.dto.movie;

import com.example.cinemabookingservice.movie.domain.MovieStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public record UpdateMovieRequest(

        @NotBlank
        String title,

        String originalTitle,

        String description,

        @Min(1)
        int durationMinutes,

        @NotNull
        LocalDate releaseDate,

        LocalDate endDate,

        String ageRating,

        String director,

        String language,

        String country,

        String posterUrl,

        String bannerUrl,

        String trailerUrl,

        @NotNull
        MovieStatus status,

        Set<Long> genreIds
) {
}