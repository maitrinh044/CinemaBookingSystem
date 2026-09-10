package com.example.cinemabookingservice.showtime.domain.repository;

import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ShowtimeRepository {
    List<Showtime> findAll();
    Optional<Showtime> findById(Long id);
    List<Showtime> findByFilters(Long movieId, List<Long> roomIds, LocalDateTime fromTime, LocalDateTime toTime, ShowtimeStatus status);
    boolean existsOverlapping(Long roomId, LocalDateTime startTime, LocalDateTime endTime, Long excludeShowtimeId);
    Showtime save(Showtime showtime);
    void deleteById(Long id);
}