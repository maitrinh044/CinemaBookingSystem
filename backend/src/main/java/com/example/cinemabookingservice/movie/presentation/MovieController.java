package com.example.cinemabookingservice.movie.presentation;

import com.example.cinemabookingservice.movie.application.dto.movie.CreateMovieRequest;
import com.example.cinemabookingservice.movie.application.dto.movie.MovieResponse;
import com.example.cinemabookingservice.movie.application.dto.movie.UpdateMovieRequest;
import com.example.cinemabookingservice.movie.application.service.MovieService;
import com.example.cinemabookingservice.movie.domain.MovieStatus;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import com.example.cinemabookingservice.shared.response.PageResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(
            MovieService movieService
    ) {
        this.movieService = movieService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(
            @Valid
            @RequestBody
            CreateMovieRequest request
    ) {

        MovieResponse movie =
                movieService.createMovie(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Create movie successfully",
                                movie
                        )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(
            @PathVariable Long id
    ) {

        MovieResponse movie =
                movieService.getMovieById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Get movie successfully",
                        movie
                )
        );
    }

    @GetMapping
    public ResponseEntity<
            ApiResponse<PageResponse<MovieResponse>>
            > getMovies(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(required = false)
            MovieStatus status,

            @RequestParam(required = false)
            String search
    ) {

        PageResponse<MovieResponse> movies;

        if (search != null && !search.isBlank()) {

            movies = movieService.searchMovies(
                    search,
                    page,
                    size
            );

        } else if (status != null) {

            movies = movieService.getMoviesByStatus(
                    status,
                    page,
                    size
            );

        } else {

            movies = movieService.getAllMovies(
                    page,
                    size
            );
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Get movies successfully",
                        movies
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @PathVariable Long id,

            @Valid
            @RequestBody
            UpdateMovieRequest request
    ) {

        MovieResponse movie =
                movieService.updateMovie(
                        id,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Update movie successfully",
                        movie
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(
            @PathVariable Long id
    ) {

        movieService.deleteMovie(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Delete movie successfully",
                        null
                )
        );
    }
}