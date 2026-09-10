package com.example.cinemabookingservice.showtime.domain.exception;

public class ShowtimeOverlapException extends RuntimeException {
    public ShowtimeOverlapException(String message) {
        super(message);
    }
}