package com.example.cinemabookingservice.showtime.infrastructure.persistence.repository;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.entity.ShowtimeSeatPriceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpringDataShowtimeSeatPriceRepository extends JpaRepository<ShowtimeSeatPriceEntity, Long> {
    List<ShowtimeSeatPriceEntity> findByShowtimeId(Long showtimeId);
    Optional<ShowtimeSeatPriceEntity> findByShowtimeIdAndSeatType(Long showtimeId, SeatType seatType);
    void deleteByShowtimeId(Long showtimeId);
}