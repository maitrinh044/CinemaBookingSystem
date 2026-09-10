package com.example.cinemabookingservice.showtime.domain.exception;

public class ShowtimeNotFoundException extends RuntimeException {
    public ShowtimeNotFoundException(String message) {
        super(message);
    }
}