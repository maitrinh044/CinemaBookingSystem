package com.example.cinemabookingservice.movie.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.domain.MovieStatus;
import com.example.cinemabookingservice.movie.domain.repository.MovieRepository;
import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.MovieEntity;
import com.example.cinemabookingservice.movie.infrastructure.persistence.mapper.MovieEntityMapper;
import com.example.cinemabookingservice.movie.infrastructure.persistence.repository.SpringDataMovieRepository;
import com.example.cinemabookingservice.shared.pagination.PageResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class MovieRepositoryAdapter
        implements MovieRepository {

    private final SpringDataMovieRepository repository;

    private static final Logger log =
            LoggerFactory.getLogger(MovieRepositoryAdapter.class);

    public MovieRepositoryAdapter(
            SpringDataMovieRepository repository
    ) {
        this.repository = repository;
    }

    @Override
    public Movie save(Movie movie) {
        MovieEntity entity = MovieEntityMapper.toEntity(movie);

        MovieEntity savedEntity = repository.saveAndFlush(entity);

        System.out.println(
                "AFTER SAVE: " + savedEntity.getUpdatedAt()
        );
        log.info("saved Entity time: " + savedEntity.getUpdatedAt());
        return MovieEntityMapper.toDomain(savedEntity);
    }

    @Override
    public java.util.Optional<Movie> findById(Long id) {

        return repository
                .findById(id)
                .map(MovieEntityMapper::toDomain);
    }

    @Override
    public PageResult<Movie> findAll(
            int pageNumber,
            int pageSize
    ) {

        Pageable pageable =
                PageRequest.of(pageNumber, pageSize);

        Page<MovieEntity> page =
                repository.findAll(pageable);

        return toPageResult(page);
    }

    @Override
    public PageResult<Movie> findByStatus(
            MovieStatus status,
            int pageNumber,
            int pageSize
    ) {

        Pageable pageable =
                PageRequest.of(pageNumber, pageSize);

        Page<MovieEntity> page =
                repository.findByStatus(
                        status,
                        pageable
                );

        return toPageResult(page);
    }

    @Override
    public PageResult<Movie> searchByTitle(
            String keyword,
            int pageNumber,
            int pageSize
    ) {

        Pageable pageable =
                PageRequest.of(pageNumber, pageSize);

        Page<MovieEntity> page =
                repository.findByTitleContainingIgnoreCase(
                        keyword,
                        pageable
                );

        return toPageResult(page);
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    private PageResult<Movie> toPageResult(
            Page<MovieEntity> page
    ) {

        var content = page
                .getContent()
                .stream()
                .map(MovieEntityMapper::toDomain)
                .toList();

        return new PageResult<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}