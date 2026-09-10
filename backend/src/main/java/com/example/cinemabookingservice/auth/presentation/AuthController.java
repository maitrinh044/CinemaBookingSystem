package com.example.cinemabookingservice.auth.presentation;

import com.example.cinemabookingservice.auth.application.dto.AuthResponse;
import com.example.cinemabookingservice.auth.application.dto.LoginRequest;
import com.example.cinemabookingservice.auth.application.dto.RefreshTokenRequest;
import com.example.cinemabookingservice.auth.application.dto.RegisterRequest;
import com.example.cinemabookingservice.auth.application.service.AuthService;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Các API đăng ký, đăng nhập và quản lý phiên JWT")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo tài khoản khách hàng mới và trả về Access Token + Refresh Token.")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký tài khoản thành công", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống", description = "Đăng nhập bằng email và mật khẩu, trả về JWT Access Token và Refresh Token.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Cấp mới Access Token", description = "Sử dụng Refresh Token còn hạn để lấy Access Token mới mà không cần đăng nhập lại.")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Làm mới phiên đăng nhập thành công", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất tài khoản", description = "Thu hồi toàn bộ Refresh Token của tài khoản hiện tại.")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            userRepository.findByEmail(userDetails.getUsername())
                    .ifPresent(user -> authService.logout(user.getId()));
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }
}