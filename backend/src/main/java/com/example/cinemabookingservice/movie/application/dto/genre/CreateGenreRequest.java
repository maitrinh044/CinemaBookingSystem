package com.example.cinemabookingservice.movie.application.dto.genre;

import jakarta.validation.constraints.NotBlank;

public record CreateGenreRequest(
    @NotBlank
    String name,
    String description
){}
