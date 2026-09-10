package com.example.cinemabookingservice.showtime.presentation;

import com.example.cinemabookingservice.shared.response.ApiResponse;
import com.example.cinemabookingservice.showtime.application.dto.CreateShowtimeRequest;
import com.example.cinemabookingservice.showtime.application.dto.ShowtimeResponse;
import com.example.cinemabookingservice.showtime.application.dto.ShowtimeSeatsMapResponse;
import com.example.cinemabookingservice.showtime.application.dto.UpdateShowtimeRequest;
import com.example.cinemabookingservice.showtime.application.service.ShowtimeService;
import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@Tag(name = "Showtimes", description = "Các API tra cứu lịch chiếu và sơ đồ giá vé theo ghế")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    @GetMapping
    @Operation(summary = "Tra cứu lịch chiếu", description = "Tìm kiếm danh sách suất chiếu lọc theo phim, rạp chiếu, ngày chiếu (YYYY-MM-DD), và trạng thái.")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getShowtimes(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long cinemaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) ShowtimeStatus status
    ) {
        List<ShowtimeResponse> responses = showtimeService.getShowtimesByFilters(movieId, cinemaId, date, status);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách suất chiếu thành công", responses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một suất chiếu", description = "Trả về thông tin phim, phòng, rạp và bảng giá vé của suất chiếu.")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> getShowtimeById(@PathVariable Long id) {
        ShowtimeResponse response = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết suất chiếu thành công", response));
    }

    @GetMapping("/{id}/seats")
    @Operation(summary = "Lấy sơ đồ ghế và bảng giá thời gian thực của suất chiếu",
            description = "Trả về toàn bộ ma trận ghế của phòng chiếu kèm giá vé tương ứng từng loại ghế (NORMAL, VIP, COUPLE) cho suất chiếu này.")
    public ResponseEntity<ApiResponse<ShowtimeSeatsMapResponse>> getShowtimeSeatsMap(@PathVariable Long id) {
        ShowtimeSeatsMapResponse response = showtimeService.getShowtimeSeatsMap(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy sơ đồ ghế suất chiếu thành công", response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Lên lịch suất chiếu mới (ADMIN / STAFF)", description = "Tạo suất chiếu mới, tự động tính giờ kết thúc và kiểm tra chống trùng giờ chiếu trong cùng phòng.")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> createShowtime(@Valid @RequestBody CreateShowtimeRequest request) {
        ShowtimeResponse created = showtimeService.createShowtime(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo suất chiếu mới thành công", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cập nhật suất chiếu (ADMIN / STAFF)", description = "Cập nhật thời gian, giá vé hoặc trạng thái suất chiếu.")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> updateShowtime(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShowtimeRequest request
    ) {
        ShowtimeResponse updated = showtimeService.updateShowtime(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật suất chiếu thành công", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Xóa suất chiếu (ADMIN)", description = "Hủy hoặc xóa suất chiếu khỏi hệ thống.")
    public ResponseEntity<ApiResponse<Void>> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa suất chiếu thành công", null));
    }
}