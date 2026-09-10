package com.example.cinemabookingservice.movie.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class Movie {

    private Long id;
    private String title;
    private String originalTitle;
    private String description;
    private int durationMinutes;

    private LocalDate releaseDate;
    private LocalDate endDate;

    private String ageRating;
    private String director;
    private String language;
    private String country;

    private String posterUrl;
    private String bannerUrl;
    private String trailerUrl;

    private MovieStatus status;

    private Set<Genre> genres = new HashSet<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Movie() {
    }

    public Movie(
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
            Set<Genre> genres,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.originalTitle = originalTitle;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.releaseDate = releaseDate;
        this.endDate = endDate;
        this.ageRating = ageRating;
        this.director = director;
        this.language = language;
        this.country = country;
        this.posterUrl = posterUrl;
        this.bannerUrl = bannerUrl;
        this.trailerUrl = trailerUrl;
        this.status = status;
        this.genres = genres;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getOriginalTitle() {
        return originalTitle;
    }

    public String getDescription() {
        return description;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getAgeRating() {
        return ageRating;
    }

    public String getDirector() {
        return director;
    }

    public String getLanguage() {
        return language;
    }

    public String getCountry() {
        return country;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public MovieStatus getStatus() {
        return status;
    }

    public Set<Genre> getGenres() {
        return genres;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setGenres(Set<Genre> genres) {
        this.genres = genres;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}