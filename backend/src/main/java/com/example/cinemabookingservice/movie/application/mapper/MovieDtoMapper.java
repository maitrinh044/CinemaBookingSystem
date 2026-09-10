package com.example.cinemabookingservice.movie.application.mapper;

import com.example.cinemabookingservice.movie.application.dto.movie.CreateMovieRequest;
import com.example.cinemabookingservice.movie.application.dto.movie.MovieResponse;
import com.example.cinemabookingservice.movie.application.dto.movie.UpdateMovieRequest;
import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.domain.Movie;

import java.util.HashSet;
import java.util.stream.Collectors;

public final class MovieDtoMapper {

    private MovieDtoMapper() {
    }

    public static Movie toDomain(CreateMovieRequest request) {
        return new Movie(
                null,
                request.title(),
                request.originalTitle(),
                request.description(),
                request.durationMinutes(),
                request.releaseDate(),
                request.endDate(),
                request.ageRating(),
                request.director(),
                request.language(),
                request.country(),
                request.posterUrl(),
                request.bannerUrl(),
                request.trailerUrl(),
                request.status(),
                new HashSet<>(),
                null,
                null
        );
    }

    public static Movie toDomain(UpdateMovieRequest request, Movie oldMovie) {
        return new Movie(
                oldMovie.getId(),
                request.title(),
                request.originalTitle(),
                request.description(),
                request.durationMinutes(),
                request.releaseDate(),
                request.endDate(),
                request.ageRating(),
                request.director(),
                request.language(),
                request.country(),
                request.posterUrl(),
                request.bannerUrl(),
                request.trailerUrl(),
                request.status(),
                oldMovie.getGenres(),
                oldMovie.getCreatedAt(),
                oldMovie.getUpdatedAt()
        );
    }

    public static MovieResponse toResponse(Movie movie) {
        var genres = movie.getGenres()
                .stream()
                .map(GenreDtoMapper::toResponse)
                .collect(Collectors.toSet());

        return new MovieResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getOriginalTitle(),
                movie.getDescription(),
                movie.getDurationMinutes(),
                movie.getReleaseDate(),
                movie.getEndDate(),
                movie.getAgeRating(),
                movie.getDirector(),
                movie.getLanguage(),
                movie.getCountry(),
                movie.getPosterUrl(),
                movie.getBannerUrl(),
                movie.getTrailerUrl(),
                movie.getStatus(),
                genres,
                movie.getCreatedAt(),
                movie.getUpdatedAt()
        );
    }
}