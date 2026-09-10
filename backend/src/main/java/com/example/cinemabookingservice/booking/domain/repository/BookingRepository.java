package com.example.cinemabookingservice.booking.domain.repository;

import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository {
    Optional<Booking> findById(Long id);
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findByUserId(Long userId);
    List<Booking> findExpiredBookings(BookingStatus status, LocalDateTime now);
    Booking save(Booking booking);
}