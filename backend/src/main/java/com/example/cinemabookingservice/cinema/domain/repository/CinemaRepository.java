package com.example.cinemabookingservice.cinema.domain.repository;

import com.example.cinemabookingservice.cinema.domain.Cinema;

import java.util.List;
import java.util.Optional;

public interface CinemaRepository {
    List<Cinema> findAll();
    List<Cinema> findByCity(String city);
    Optional<Cinema> findById(Long id);
    Cinema save(Cinema cinema);
    void deleteById(Long id);
}