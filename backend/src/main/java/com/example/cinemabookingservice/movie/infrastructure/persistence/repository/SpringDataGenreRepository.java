package com.example.cinemabookingservice.movie.infrastructure.persistence.repository;

import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.GenreEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataGenreRepository
        extends JpaRepository<GenreEntity, Long> {

    boolean existsByNameIgnoreCase(String name);

    Page<GenreEntity> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );
}