package com.example.cinemabookingservice.movie.infrastructure.persistence.repository;

import com.example.cinemabookingservice.movie.domain.MovieStatus;
import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.MovieEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataMovieRepository
        extends JpaRepository<MovieEntity, Long> {

    Page<MovieEntity> findByStatus(
            MovieStatus status,
            Pageable pageable
    );

    Page<MovieEntity> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable
    );
}