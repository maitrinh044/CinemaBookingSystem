package com.example.cinemabookingservice.booking.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingStatus;
import com.example.cinemabookingservice.booking.domain.repository.BookingRepository;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.BookingEntity;
import com.example.cinemabookingservice.booking.infrastructure.persistence.mapper.BookingEntityMapper;
import com.example.cinemabookingservice.booking.infrastructure.persistence.repository.SpringDataBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BookingRepositoryAdapter implements BookingRepository {

    private final SpringDataBookingRepository springDataBookingRepository;
    private final BookingEntityMapper bookingEntityMapper;

    @Override
    public Optional<Booking> findById(Long id) {
        return springDataBookingRepository.findById(id).map(bookingEntityMapper::toDomain);
    }

    @Override
    public Optional<Booking> findByBookingCode(String bookingCode) {
        return springDataBookingRepository.findByBookingCode(bookingCode).map(bookingEntityMapper::toDomain);
    }

    @Override
    public List<Booking> findByUserId(Long userId) {
        return springDataBookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(bookingEntityMapper::toDomain)
                .toList();
    }

    @Override
    public List<Booking> findExpiredBookings(BookingStatus status, LocalDateTime now) {
        return springDataBookingRepository.findExpiredBookings(status, now).stream()
                .map(bookingEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Booking save(Booking booking) {
        BookingEntity entity = bookingEntityMapper.toEntity(booking);
        BookingEntity saved = springDataBookingRepository.save(entity);
        return bookingEntityMapper.toDomain(saved);
    }
}