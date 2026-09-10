package com.example.cinemabookingservice.user.presentation;

import com.example.cinemabookingservice.shared.response.ApiResponse;
import com.example.cinemabookingservice.user.application.dto.ChangePasswordRequest;
import com.example.cinemabookingservice.user.application.dto.UpdateProfileRequest;
import com.example.cinemabookingservice.user.application.dto.UserResponse;
import com.example.cinemabookingservice.user.application.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Các API xem và cập nhật hồ sơ người dùng")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại", description = "Trả về hồ sơ cá nhân của người dùng đăng nhập từ JWT Token.")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = userService.getMe(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tài khoản thành công", response));
    }

    @PutMapping("/me")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Cập nhật họ tên hoặc số điện thoại.")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ thành công", response));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Đổi mật khẩu tài khoản", description = "Kiểm tra mật khẩu cũ và lưu mật khẩu mới mã hóa.")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }
}