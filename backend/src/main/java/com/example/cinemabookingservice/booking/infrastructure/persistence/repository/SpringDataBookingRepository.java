package com.example.cinemabookingservice.booking.infrastructure.persistence.repository;

import com.example.cinemabookingservice.booking.domain.BookingStatus;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpringDataBookingRepository extends JpaRepository<BookingEntity, Long> {
    Optional<BookingEntity> findByBookingCode(String bookingCode);
    List<BookingEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b FROM BookingEntity b WHERE b.status = :status AND b.expiresAt IS NOT NULL AND b.expiresAt < :now")
    List<BookingEntity> findExpiredBookings(@Param("status") BookingStatus status, @Param("now") LocalDateTime now);
}