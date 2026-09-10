package com.example.cinemabookingservice.cinema.domain.repository;

import com.example.cinemabookingservice.cinema.domain.Room;

import java.util.List;
import java.util.Optional;

public interface RoomRepository {
    List<Room> findByCinemaId(Long cinemaId);
    Optional<Room> findById(Long id);
    Room save(Room room);
    void deleteById(Long id);
}