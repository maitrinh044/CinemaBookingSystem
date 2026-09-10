package com.example.cinemabookingservice.movie.domain.repository;

import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.shared.pagination.PageResult;

import java.util.Optional;
import java.util.Set;

public interface GenreRepository {

    Genre save(Genre genre);

    Optional<Genre> findById(Long id);

    PageResult<Genre> findAll(
            int pageNumber,
            int pageSize
    );

    PageResult<Genre> searchByName(
            String keyword,
            int pageNumber,
            int pageSize
    );

    Set<Genre> findAllByIds(Set<Long> ids);

    boolean existsById(Long id);

    boolean existsByName(String name);

    void deleteById(Long id);
}