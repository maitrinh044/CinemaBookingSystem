package com.example.cinemabookingservice.booking.domain.repository;

import com.example.cinemabookingservice.booking.domain.BookingSeat;

import java.util.List;
import java.util.Optional;

public interface BookingSeatRepository {
    List<BookingSeat> findByBookingId(Long bookingId);
    List<BookingSeat> findByShowtimeId(Long showtimeId);
    Optional<BookingSeat> findById(Long id);
    boolean isAnySeatBooked(Long showtimeId, List<Long> seatIds);
    List<BookingSeat> saveAll(List<BookingSeat> bookingSeats);
    void deleteByBookingId(Long bookingId);
}