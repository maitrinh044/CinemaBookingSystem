package com.example.cinemabookingservice.movie.domain.repository;

import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.domain.MovieStatus;
import com.example.cinemabookingservice.shared.pagination.PageResult;

import java.util.Optional;

public interface MovieRepository {

    Movie save(Movie movie);

    Optional<Movie> findById(Long id);

    PageResult<Movie> findAll(
            int pageNumber,
            int pageSize
    );

    PageResult<Movie> findByStatus(
            MovieStatus status,
            int pageNumber,
            int pageSize
    );

    PageResult<Movie> searchByTitle(
            String keyword,
            int pageNumber,
            int pageSize
    );

    boolean existsById(Long id);

    void deleteById(Long id);
}