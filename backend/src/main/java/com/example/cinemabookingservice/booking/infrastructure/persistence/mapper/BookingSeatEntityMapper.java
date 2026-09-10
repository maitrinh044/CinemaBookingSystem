package com.example.cinemabookingservice.booking.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.booking.domain.BookingSeat;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.BookingSeatEntity;
import org.springframework.stereotype.Component;

@Component
public class BookingSeatEntityMapper {

    public BookingSeat toDomain(BookingSeatEntity entity) {
        if (entity == null) return null;
        return BookingSeat.builder()
                .id(entity.getId())
                .bookingId(entity.getBookingId())
                .showtimeId(entity.getShowtimeId())
                .seatId(entity.getSeatId())
                .price(entity.getPrice())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public BookingSeatEntity toEntity(BookingSeat domain) {
        if (domain == null) return null;
        return BookingSeatEntity.builder()
                .id(domain.getId())
                .bookingId(domain.getBookingId())
                .showtimeId(domain.getShowtimeId())
                .seatId(domain.getSeatId())
                .price(domain.getPrice())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}