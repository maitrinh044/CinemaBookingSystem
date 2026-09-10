package com.example.cinemabookingservice.booking.domain.exception;

public class TicketAlreadyUsedException extends RuntimeException {
    public TicketAlreadyUsedException(String message) {
        super(message);
    }
}