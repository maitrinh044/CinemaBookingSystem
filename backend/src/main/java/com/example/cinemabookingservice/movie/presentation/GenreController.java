package com.example.cinemabookingservice.movie.presentation;

import com.example.cinemabookingservice.movie.application.dto.genre.CreateGenreRequest;
import com.example.cinemabookingservice.movie.application.dto.genre.GenreResponse;
import com.example.cinemabookingservice.movie.application.dto.genre.UpdateGenreRequest;
import com.example.cinemabookingservice.movie.application.service.GenreService;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import com.example.cinemabookingservice.shared.response.PageResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreService genreService;

    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GenreResponse>> createGenre(
            @Valid @RequestBody CreateGenreRequest request) {

        GenreResponse genre = genreService.createGenre(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Create genre successfully", genre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GenreResponse>> getGenreById(
            @PathVariable Long id) {

        GenreResponse genre = genreService.getGenreById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Get genre successfully", genre)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<GenreResponse>>> getGenres(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        PageResponse<GenreResponse> genres;

        if (search != null && !search.isBlank()) {
            genres = genreService.searchGenres(search, page, size);
        } else {
            genres = genreService.getAllGenres(page, size);
        }

        return ResponseEntity.ok(
                ApiResponse.success("Get genres successfully", genres)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GenreResponse>> updateGenre(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGenreRequest request) {

        GenreResponse genre = genreService.updateGenre(id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Update genre successfully", genre)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGenre(
            @PathVariable Long id) {

        genreService.deleteGenre(id);

        return ResponseEntity.ok(
                ApiResponse.success("Delete genre successfully", null)
        );
    }
}