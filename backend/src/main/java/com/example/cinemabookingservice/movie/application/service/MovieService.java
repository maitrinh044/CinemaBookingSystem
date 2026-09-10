package com.example.cinemabookingservice.movie.application.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.cinemabookingservice.movie.application.dto.movie.CreateMovieRequest;
import com.example.cinemabookingservice.movie.application.dto.movie.MovieResponse;
import com.example.cinemabookingservice.movie.application.dto.movie.UpdateMovieRequest;
import com.example.cinemabookingservice.movie.application.mapper.MovieDtoMapper;
import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.domain.MovieStatus;
import com.example.cinemabookingservice.movie.domain.exception.MovieNotFoundException;
import com.example.cinemabookingservice.movie.domain.repository.GenreRepository;
import com.example.cinemabookingservice.movie.domain.repository.MovieRepository;
import com.example.cinemabookingservice.shared.pagination.PageResult;
import com.example.cinemabookingservice.shared.response.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private static final Logger log =
            LoggerFactory.getLogger(MovieService.class);

    public MovieService(
            MovieRepository movieRepository,
            GenreRepository genreRepository
    ) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    public MovieResponse createMovie(CreateMovieRequest request) {
        Movie movie = MovieDtoMapper.toDomain(request);

        if (request.genreIds() != null && !request.genreIds().isEmpty()) {
            Set<Genre> genres = genreRepository.findAllByIds(request.genreIds());

            if (genres.size() != request.genreIds().size()) {
                throw new IllegalArgumentException("One or more genres do not exist");
            }

            movie.setGenres(genres);
        }

        Movie savedMovie = movieRepository.save(movie);

        return MovieDtoMapper.toResponse(savedMovie);
    }

    @Transactional(readOnly = true)
    public MovieResponse getMovieById(Long id) {

        Movie movie = movieRepository
                .findById(id)
                .orElseThrow(
                        () -> new MovieNotFoundException(id)
                );

        return MovieDtoMapper.toResponse(movie);
    }

    @Transactional(readOnly = true)
    public PageResponse<MovieResponse> getAllMovies(
            int pageNumber,
            int pageSize
    ) {

        PageResult<Movie> result =
                movieRepository.findAll(
                        pageNumber,
                        pageSize
                );

        return toPageResponse(result);
    }

    @Transactional(readOnly = true)
    public PageResponse<MovieResponse> getMoviesByStatus(
            MovieStatus status,
            int pageNumber,
            int pageSize
    ) {

        PageResult<Movie> result =
                movieRepository.findByStatus(
                        status,
                        pageNumber,
                        pageSize
                );

        return toPageResponse(result);
    }

    @Transactional(readOnly = true)
    public PageResponse<MovieResponse> searchMovies(
            String keyword,
            int pageNumber,
            int pageSize
    ) {

        PageResult<Movie> result =
                movieRepository.searchByTitle(
                        keyword,
                        pageNumber,
                        pageSize
                );

        return toPageResponse(result);
    }

    public MovieResponse updateMovie(Long id, UpdateMovieRequest request) {
        log.info("Updating movie id={}", id);

        Movie oldMovie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Movie not found with id={}", id);
                    return new MovieNotFoundException(id);
                });

        Movie updatedMovie = MovieDtoMapper.toDomain(request, oldMovie);
        Movie savedMovie = movieRepository.save(updatedMovie);

        log.info("Movie updated time ={}", savedMovie.getUpdatedAt());
        log.info("Movie updated successfully id={}", id);

        return MovieDtoMapper.toResponse(savedMovie);
    }

    public void deleteMovie(Long id) {

        if (!movieRepository.existsById(id)) {
            throw new MovieNotFoundException(id);
        }

        movieRepository.deleteById(id);
    }

    private PageResponse<MovieResponse> toPageResponse(
            PageResult<Movie> result
    ) {

        var content = result
                .content()
                .stream()
                .map(MovieDtoMapper::toResponse)
                .toList();

        return new PageResponse<>(
                content,
                result.page(),
                result.size(),
                result.totalElements(),
                result.totalPages(),
                result.first(),
                result.last()
        );
    }
}