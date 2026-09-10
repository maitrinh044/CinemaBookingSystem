package com.example.cinemabookingservice.booking.presentation;

import com.example.cinemabookingservice.booking.application.dto.BookingResponse;
import com.example.cinemabookingservice.booking.application.dto.HoldSeatsRequest;
import com.example.cinemabookingservice.booking.application.service.BookingService;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Các API giữ chỗ, hủy giữ chỗ và quản lý đơn đặt vé")
@SecurityRequirement(name = "Bearer Authentication")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/hold")
    @Operation(summary = "Giữ ghế tạm thời (5 phút)", description = "Tạo đơn đặt vé tạm thời với trạng thái PENDING, khóa các ghế được chọn trong 5 phút. Nếu có ghế bị trùng, ném lỗi 409 Conflict.")
    public ResponseEntity<ApiResponse<BookingResponse>> holdSeats(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HoldSeatsRequest request
    ) {
        BookingResponse response = bookingService.holdSeats(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Giữ ghế thành công! Vui lòng hoàn tất thanh toán trong vòng 5 phút.", response));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Hủy giữ ghế chủ động", description = "Giải phóng ghế ngay lập tức và chuyển đơn hàng sang trạng thái CANCELLED.")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        bookingService.cancelBooking(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Hủy giữ chỗ thành công", null));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Lịch sử đặt vé của cá nhân", description = "Lấy danh sách tất cả các đơn đặt vé (PENDING, CONFIRMED, EXPIRED...) của tài khoản đang đăng nhập.")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<BookingResponse> responses = bookingService.getMyBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đơn đặt vé thành công", responses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Tra cứu đơn đặt vé theo ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingResponse response = bookingService.getBookingById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin đơn đặt vé thành công", response));
    }

    @GetMapping("/code/{bookingCode}")
    @Operation(summary = "Tra cứu đơn đặt vé theo mã đơn (bookingCode)")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByCode(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String bookingCode
    ) {
        BookingResponse response = bookingService.getBookingByCode(bookingCode, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin đơn đặt vé thành công", response));
    }
}