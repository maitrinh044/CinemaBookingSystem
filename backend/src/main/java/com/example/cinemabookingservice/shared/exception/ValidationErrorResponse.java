package com.example.cinemabookingservice.shared.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ValidationErrorResponse(
        int status,
        String error,
        String message,
        String path,
        Map<String, String> errors,
        LocalDateTime timestamp
) {
}