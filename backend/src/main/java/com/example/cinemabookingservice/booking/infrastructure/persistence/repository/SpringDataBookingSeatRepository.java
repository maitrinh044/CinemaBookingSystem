package com.example.cinemabookingservice.booking.infrastructure.persistence.repository;

import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.BookingSeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataBookingSeatRepository extends JpaRepository<BookingSeatEntity, Long> {
    List<BookingSeatEntity> findByBookingId(Long bookingId);
    List<BookingSeatEntity> findByShowtimeId(Long showtimeId);

    @Query("SELECT COUNT(bs) > 0 FROM BookingSeatEntity bs WHERE bs.showtimeId = :showtimeId AND bs.seatId IN :seatIds")
    boolean isAnySeatBooked(@Param("showtimeId") Long showtimeId, @Param("seatIds") List<Long> seatIds);

    void deleteByBookingId(Long bookingId);
}