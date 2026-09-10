package com.example.cinemabookingservice.cinema.presentation;

import com.example.cinemabookingservice.cinema.application.dto.cinema.CinemaResponse;
import com.example.cinemabookingservice.cinema.application.dto.cinema.CreateCinemaRequest;
import com.example.cinemabookingservice.cinema.application.dto.cinema.UpdateCinemaRequest;
import com.example.cinemabookingservice.cinema.application.service.CinemaService;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
@Tag(name = "Cinemas", description = "Các API quản lý danh sách và thông tin cụm rạp")
public class CinemaController {

    private final CinemaService cinemaService;

    @GetMapping
    @Operation(summary = "Lấy danh sách cụm rạp", description = "Lấy tất cả cụm rạp, có thể lọc theo tỉnh/thành phố bằng query param ?city=...")
    public ResponseEntity<ApiResponse<List<CinemaResponse>>> getAllCinemas(
            @RequestParam(required = false) String city
    ) {
        List<CinemaResponse> cinemas = cinemaService.getAllCinemas(city);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cụm rạp thành công", cinemas));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết một cụm rạp", description = "Trả về thông tin chi tiết của cụm rạp theo ID.")
    public ResponseEntity<ApiResponse<CinemaResponse>> getCinemaById(@PathVariable Long id) {
        CinemaResponse cinema = cinemaService.getCinemaById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết cụm rạp thành công", cinema));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Thêm cụm rạp mới", description = "Tạo mới cụm rạp (chỉ dành cho ADMIN hoặc STAFF).")
    public ResponseEntity<ApiResponse<CinemaResponse>> createCinema(@Valid @RequestBody CreateCinemaRequest request) {
        CinemaResponse created = cinemaService.createCinema(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm cụm rạp mới thành công", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cập nhật cụm rạp", description = "Cập nhật thông tin cụm rạp theo ID (chỉ dành cho ADMIN).")
    public ResponseEntity<ApiResponse<CinemaResponse>> updateCinema(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCinemaRequest request
    ) {
        CinemaResponse updated = cinemaService.updateCinema(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật cụm rạp thành công", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xóa cụm rạp", description = "Xóa cụm rạp theo ID (chỉ dành cho ADMIN).")
    public ResponseEntity<ApiResponse<Void>> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa cụm rạp thành công", null));
    }
}