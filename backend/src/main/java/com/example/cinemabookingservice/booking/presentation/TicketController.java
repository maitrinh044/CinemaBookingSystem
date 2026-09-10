package com.example.cinemabookingservice.booking.presentation;

import com.example.cinemabookingservice.booking.application.dto.TicketCheckInRequest;
import com.example.cinemabookingservice.booking.application.dto.TicketCheckInResponse;
import com.example.cinemabookingservice.booking.application.dto.TicketResponse;
import com.example.cinemabookingservice.booking.application.service.TicketService;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Tag(name = "Tickets", description = "Các API vé điện tử và soát vé qua mã QR tại cửa rạp")
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/my-tickets")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Danh sách vé điện tử của cá nhân", description = "Trả về tất cả các vé điện tử kèm mã QR của tài khoản đang đăng nhập.")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<TicketResponse> responses = ticketService.getMyTickets(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vé điện tử thành công", responses));
    }

    @GetMapping("/code/{ticketCode}")
    @Operation(summary = "Tra cứu thông tin một chiếc vé theo mã vé (ticketCode)")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketByCode(@PathVariable String ticketCode) {
        TicketResponse response = ticketService.getTicketByCode(ticketCode);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin vé thành công", response));
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Soát vé tại cửa rạp qua mã QR (STAFF / ADMIN)",
            description = "Nhân viên rạp quét chuỗi mã QR hoặc nhập mã vé để xác thực và chuyển trạng thái vé sang USED.")
    public ResponseEntity<ApiResponse<TicketCheckInResponse>> checkInTicket(
            @Valid @RequestBody TicketCheckInRequest request
    ) {
        TicketCheckInResponse response = ticketService.checkInTicket(request);
        return ResponseEntity.ok(ApiResponse.success("Soát vé thành công", response));
    }
}