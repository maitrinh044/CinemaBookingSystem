package com.example.cinemabookingservice.cinema.domain.repository;

import com.example.cinemabookingservice.cinema.domain.Seat;

import java.util.List;
import java.util.Optional;

public interface SeatRepository {
    List<Seat> findByRoomId(Long roomId);
    Optional<Seat> findById(Long id);
    List<Seat> saveAll(List<Seat> seats);
    Seat save(Seat seat);
    void deleteByRoomId(Long roomId);
}