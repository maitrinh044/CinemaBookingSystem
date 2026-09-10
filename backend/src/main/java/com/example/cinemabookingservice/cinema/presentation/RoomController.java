package com.example.cinemabookingservice.cinema.presentation;

import com.example.cinemabookingservice.cinema.application.dto.room.CreateRoomRequest;
import com.example.cinemabookingservice.cinema.application.dto.room.RoomDetailResponse;
import com.example.cinemabookingservice.cinema.application.dto.room.RoomResponse;
import com.example.cinemabookingservice.cinema.application.dto.room.UpdateRoomRequest;
import com.example.cinemabookingservice.cinema.application.dto.seat.GenerateSeatsRequest;
import com.example.cinemabookingservice.cinema.application.dto.seat.SeatResponse;
import com.example.cinemabookingservice.cinema.application.service.RoomService;
import com.example.cinemabookingservice.cinema.application.service.SeatService;
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
@RequiredArgsConstructor
@Tag(name = "Rooms & Seats", description = "Các API quản lý phòng chiếu và sơ đồ ghế ngồi")
public class RoomController {

    private final RoomService roomService;
    private final SeatService seatService;

    @GetMapping("/api/cinemas/{cinemaId}/rooms")
    @Operation(summary = "Lấy danh sách phòng chiếu của một cụm rạp")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getRoomsByCinema(@PathVariable Long cinemaId) {
        List<RoomResponse> rooms = roomService.getRoomsByCinemaId(cinemaId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phòng chiếu thành công", rooms));
    }

    @GetMapping("/api/rooms/{id}")
    @Operation(summary = "Lấy thông tin phòng chiếu theo ID")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Long id) {
        RoomResponse room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin phòng chiếu thành công", room));
    }

    @GetMapping("/api/rooms/{id}/detail")
    @Operation(summary = "Lấy chi tiết phòng chiếu kèm ma trận ghế")
    public ResponseEntity<ApiResponse<RoomDetailResponse>> getRoomDetail(@PathVariable Long id) {
        RoomDetailResponse detail = roomService.getRoomDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết phòng chiếu và danh sách ghế thành công", detail));
    }

    @GetMapping("/api/rooms/{id}/seats")
    @Operation(summary = "Lấy danh sách toàn bộ ghế của một phòng chiếu")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatsByRoom(@PathVariable Long id) {
        List<SeatResponse> seats = seatService.getSeatsByRoomId(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ghế của phòng thành công", seats));
    }

    @PostMapping("/api/cinemas/{cinemaId}/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Tạo phòng chiếu mới cho rạp (ADMIN)")
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
            @PathVariable Long cinemaId,
            @Valid @RequestBody CreateRoomRequest request
    ) {
        RoomResponse created = roomService.createRoom(cinemaId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo phòng chiếu mới thành công", created));
    }

    @PutMapping("/api/rooms/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cập nhật phòng chiếu (ADMIN)")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomRequest request
    ) {
        RoomResponse updated = roomService.updateRoom(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phòng chiếu thành công", updated));
    }

    @PostMapping("/api/rooms/{id}/generate-seats")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Tự động sinh ma trận ghế cho phòng chiếu (ADMIN)", description = "Tự động tạo các hàng ghế theo totalRows và totalColumns, cấu hình hàng VIP và Couple.")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> generateSeats(
            @PathVariable Long id,
            @RequestBody(required = false) GenerateSeatsRequest request
    ) {
        List<SeatResponse> seats = seatService.generateSeats(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo ma trận ghế thành công", seats));
    }
}