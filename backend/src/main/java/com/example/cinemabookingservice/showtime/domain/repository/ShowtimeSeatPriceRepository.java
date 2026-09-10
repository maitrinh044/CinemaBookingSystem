package com.example.cinemabookingservice.showtime.domain.repository;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;

import java.util.List;
import java.util.Optional;

public interface ShowtimeSeatPriceRepository {
    List<ShowtimeSeatPrice> findByShowtimeId(Long showtimeId);
    Optional<ShowtimeSeatPrice> findByShowtimeIdAndSeatType(Long showtimeId, SeatType seatType);
    List<ShowtimeSeatPrice> saveAll(List<ShowtimeSeatPrice> prices);
    void deleteByShowtimeId(Long showtimeId);
}