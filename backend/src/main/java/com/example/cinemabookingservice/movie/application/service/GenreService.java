package com.example.cinemabookingservice.movie.application.service;

import com.example.cinemabookingservice.movie.application.dto.genre.CreateGenreRequest;
import com.example.cinemabookingservice.movie.application.dto.genre.GenreResponse;
import com.example.cinemabookingservice.movie.application.dto.genre.UpdateGenreRequest;
import com.example.cinemabookingservice.movie.application.mapper.GenreDtoMapper;
import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.domain.exception.GenreNotFoundException;
import com.example.cinemabookingservice.movie.domain.repository.GenreRepository;
import com.example.cinemabookingservice.shared.pagination.PageResult;
import com.example.cinemabookingservice.shared.response.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public GenreResponse createGenre(CreateGenreRequest request) {
        if (genreRepository.existsByName(request.name())) {
            throw new IllegalArgumentException(
                    "Genre name already exists: " + request.name()
            );
        }

        Genre genre = GenreDtoMapper.toDomain(request);
        Genre savedGenre = genreRepository.save(genre);

        return GenreDtoMapper.toResponse(savedGenre);
    }

    @Transactional(readOnly = true)
    public GenreResponse getGenreById(Long id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new GenreNotFoundException(id));

        return GenreDtoMapper.toResponse(genre);
    }

    @Transactional(readOnly = true)
    public PageResponse<GenreResponse> getAllGenres(int pageNumber, int pageSize) {
        PageResult<Genre> result = genreRepository.findAll(pageNumber, pageSize);

        return toPageResponse(result);
    }

    @Transactional(readOnly = true)
    public PageResponse<GenreResponse> searchGenres(
            String keyword,
            int pageNumber,
            int pageSize) {

        PageResult<Genre> result =
                genreRepository.searchByName(keyword, pageNumber, pageSize);

        return toPageResponse(result);
    }

    public GenreResponse updateGenre(
            Long id,
            UpdateGenreRequest request) {

        Genre oldGenre = genreRepository.findById(id)
                .orElseThrow(() -> new GenreNotFoundException(id));

        boolean nameChanged =
                !oldGenre.getName().equalsIgnoreCase(request.name());

        if (nameChanged && genreRepository.existsByName(request.name())) {
            throw new IllegalArgumentException(
                    "Genre name already exists: " + request.name()
            );
        }

        Genre updatedGenre =
                GenreDtoMapper.toDomain(request, oldGenre);

        Genre savedGenre =
                genreRepository.save(updatedGenre);

        return GenreDtoMapper.toResponse(savedGenre);
    }

    public void deleteGenre(Long id) {
        if (!genreRepository.existsById(id)) {
            throw new GenreNotFoundException(id);
        }

        genreRepository.deleteById(id);
    }

    private PageResponse<GenreResponse> toPageResponse(PageResult<Genre> result) {
        var content = result.content()
                .stream()
                .map(GenreDtoMapper::toResponse)
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