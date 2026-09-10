package com.example.cinemabookingservice.booking.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.BookingEntity;
import org.springframework.stereotype.Component;

@Component
public class BookingEntityMapper {

    public Booking toDomain(BookingEntity entity) {
        if (entity == null) return null;
        return Booking.builder()
                .id(entity.getId())
                .bookingCode(entity.getBookingCode())
                .userId(entity.getUserId())
                .showtimeId(entity.getShowtimeId())
                .status(entity.getStatus())
                .totalAmount(entity.getTotalAmount())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .confirmedAt(entity.getConfirmedAt())
                .cancelledAt(entity.getCancelledAt())
                .build();
    }

    public BookingEntity toEntity(Booking domain) {
        if (domain == null) return null;
        return BookingEntity.builder()
                .id(domain.getId())
                .bookingCode(domain.getBookingCode())
                .userId(domain.getUserId())
                .showtimeId(domain.getShowtimeId())
                .status(domain.getStatus())
                .totalAmount(domain.getTotalAmount())
                .expiresAt(domain.getExpiresAt())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .confirmedAt(domain.getConfirmedAt())
                .cancelledAt(domain.getCancelledAt())
                .build();
    }
}