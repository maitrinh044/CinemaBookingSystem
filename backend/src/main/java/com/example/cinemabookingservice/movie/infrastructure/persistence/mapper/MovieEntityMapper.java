package com.example.cinemabookingservice.movie.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.GenreEntity;
import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.MovieEntity;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class MovieEntityMapper {

    private MovieEntityMapper() {
    }

    public static Movie toDomain(MovieEntity entity) {
        Set<Genre> genres = entity.getGenres() == null
                ? new HashSet<>()
                : entity.getGenres()
                .stream()
                .map(GenreEntityMapper::toDomain)
                .collect(Collectors.toSet());

        return new Movie(
                entity.getId(),
                entity.getTitle(),
                entity.getOriginalTitle(),
                entity.getDescription(),
                entity.getDurationMinutes(),
                entity.getReleaseDate(),
                entity.getEndDate(),
                entity.getAgeRating(),
                entity.getDirector(),
                entity.getLanguage(),
                entity.getCountry(),
                entity.getPosterUrl(),
                entity.getBannerUrl(),
                entity.getTrailerUrl(),
                entity.getStatus(),
                genres,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public static MovieEntity toEntity(Movie movie) {
        MovieEntity entity = new MovieEntity();

        entity.setId(movie.getId());
        entity.setTitle(movie.getTitle());
        entity.setOriginalTitle(movie.getOriginalTitle());
        entity.setDescription(movie.getDescription());
        entity.setDurationMinutes(movie.getDurationMinutes());
        entity.setReleaseDate(movie.getReleaseDate());
        entity.setEndDate(movie.getEndDate());
        entity.setAgeRating(movie.getAgeRating());
        entity.setDirector(movie.getDirector());
        entity.setLanguage(movie.getLanguage());
        entity.setCountry(movie.getCountry());
        entity.setPosterUrl(movie.getPosterUrl());
        entity.setBannerUrl(movie.getBannerUrl());
        entity.setTrailerUrl(movie.getTrailerUrl());
        entity.setStatus(movie.getStatus());

        if (movie.getGenres() != null) {
            Set<GenreEntity> genres = movie.getGenres()
                    .stream()
                    .map(GenreEntityMapper::toEntity)
                    .collect(Collectors.toSet());

            entity.setGenres(genres);
        }

        entity.setCreatedAt(movie.getCreatedAt());
        entity.setUpdatedAt(movie.getUpdatedAt());

        return entity;
    }
}