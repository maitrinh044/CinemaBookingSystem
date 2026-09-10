package com.example.cinemabookingservice.movie.domain.exception;

public class MovieNotFoundException extends RuntimeException {

    public MovieNotFoundException(Long id) {
        super("Movie not found with id: " + id);
    }

    public MovieNotFoundException(String message) {
        super(message);
    }
}