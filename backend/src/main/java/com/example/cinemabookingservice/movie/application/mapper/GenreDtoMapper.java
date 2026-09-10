package com.example.cinemabookingservice.movie.application.mapper;

import com.example.cinemabookingservice.movie.application.dto.genre.CreateGenreRequest;
import com.example.cinemabookingservice.movie.application.dto.genre.GenreResponse;
import com.example.cinemabookingservice.movie.application.dto.genre.UpdateGenreRequest;
import com.example.cinemabookingservice.movie.domain.Genre;

import java.time.LocalDateTime;

public final class GenreDtoMapper {

    private GenreDtoMapper() {
    }

    public static Genre toDomain(
            CreateGenreRequest request
    ) {

        return new Genre(
                null,
                request.name(),
                request.description(),
                LocalDateTime.now(),
                null
        );
    }

    public static Genre toDomain(
            UpdateGenreRequest request,
            Genre oldGenre
    ) {

        return new Genre(
                oldGenre.getId(),
                request.name(),
                request.description(),
                oldGenre.getCreatedAt(),
                LocalDateTime.now()
        );
    }

    public static GenreResponse toResponse(
            Genre genre
    ) {

        return new GenreResponse(
                genre.getId(),
                genre.getName(),
                genre.getDescription(),
                genre.getCreatedAt(),
                genre.getUpdatedAt()
        );
    }
}