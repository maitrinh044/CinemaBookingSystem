package com.example.cinemabookingservice.cinema.infrastructure.persistence.repository;

import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.CinemaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataCinemaRepository extends JpaRepository<CinemaEntity, Long> {
    List<CinemaEntity> findByCityIgnoreCase(String city);
}