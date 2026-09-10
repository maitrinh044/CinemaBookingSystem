package com.example.cinemabookingservice.movie.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.domain.repository.GenreRepository;
import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.GenreEntity;
import com.example.cinemabookingservice.movie.infrastructure.persistence.mapper.GenreEntityMapper;
import com.example.cinemabookingservice.movie.infrastructure.persistence.repository.SpringDataGenreRepository;
import com.example.cinemabookingservice.shared.pagination.PageResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class GenreRepositoryAdapter
        implements GenreRepository {

    private final SpringDataGenreRepository repository;

    public GenreRepositoryAdapter(
            SpringDataGenreRepository repository
    ) {
        this.repository = repository;
    }

    @Override
    public Genre save(Genre genre) {

        GenreEntity entity =
                GenreEntityMapper.toEntity(genre);

        GenreEntity savedEntity =
                repository.save(entity);

        return GenreEntityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Genre> findById(Long id) {

        return repository
                .findById(id)
                .map(GenreEntityMapper::toDomain);
    }

    @Override
    public PageResult<Genre> findAll(
            int pageNumber,
            int pageSize
    ) {

        Pageable pageable =
                PageRequest.of(
                        pageNumber,
                        pageSize
                );

        Page<GenreEntity> page =
                repository.findAll(pageable);

        return toPageResult(page);
    }

    @Override
    public PageResult<Genre> searchByName(
            String keyword,
            int pageNumber,
            int pageSize
    ) {

        Pageable pageable =
                PageRequest.of(
                        pageNumber,
                        pageSize
                );

        Page<GenreEntity> page =
                repository.findByNameContainingIgnoreCase(
                        keyword,
                        pageable
                );

        return toPageResult(page);
    }

    @Override
    public Set<Genre> findAllByIds(Set<Long> ids) {

        return repository
                .findAllById(ids)
                .stream()
                .map(GenreEntityMapper::toDomain)
                .collect(Collectors.toSet());
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return repository.existsByNameIgnoreCase(name);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    private PageResult<Genre> toPageResult(
            Page<GenreEntity> page
    ) {

        var content = page
                .getContent()
                .stream()
                .map(GenreEntityMapper::toDomain)
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