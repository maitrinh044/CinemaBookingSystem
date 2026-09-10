package com.example.cinemabookingservice.booking.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.booking.domain.BookingSeat;
import com.example.cinemabookingservice.booking.domain.repository.BookingSeatRepository;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.BookingSeatEntity;
import com.example.cinemabookingservice.booking.infrastructure.persistence.mapper.BookingSeatEntityMapper;
import com.example.cinemabookingservice.booking.infrastructure.persistence.repository.SpringDataBookingSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BookingSeatRepositoryAdapter implements BookingSeatRepository {

    private final SpringDataBookingSeatRepository springDataBookingSeatRepository;
    private final BookingSeatEntityMapper bookingSeatEntityMapper;

    @Override
    public List<BookingSeat> findByBookingId(Long bookingId) {
        return springDataBookingSeatRepository.findByBookingId(bookingId).stream()
                .map(bookingSeatEntityMapper::toDomain)
                .toList();
    }

    @Override
    public List<BookingSeat> findByShowtimeId(Long showtimeId) {
        return springDataBookingSeatRepository.findByShowtimeId(showtimeId).stream()
                .map(bookingSeatEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<BookingSeat> findById(Long id) {
        return springDataBookingSeatRepository.findById(id).map(bookingSeatEntityMapper::toDomain);
    }

    @Override
    public boolean isAnySeatBooked(Long showtimeId, List<Long> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) return false;
        return springDataBookingSeatRepository.isAnySeatBooked(showtimeId, seatIds);
    }

    @Override
    public List<BookingSeat> saveAll(List<BookingSeat> bookingSeats) {
        List<BookingSeatEntity> entities = bookingSeats.stream()
                .map(bookingSeatEntityMapper::toEntity)
                .toList();
        return springDataBookingSeatRepository.saveAll(entities).stream()
                .map(bookingSeatEntityMapper::toDomain)
                .toList();
    }

    @Override
    @Transactional
    public void deleteByBookingId(Long bookingId) {
        springDataBookingSeatRepository.deleteByBookingId(bookingId);
    }
}