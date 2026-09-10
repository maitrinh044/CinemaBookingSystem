package com.example.cinemabookingservice.auth.application.service;

import com.example.cinemabookingservice.auth.application.dto.AuthResponse;
import com.example.cinemabookingservice.auth.application.dto.LoginRequest;
import com.example.cinemabookingservice.auth.application.dto.RefreshTokenRequest;
import com.example.cinemabookingservice.auth.application.dto.RegisterRequest;
import com.example.cinemabookingservice.auth.infrastructure.security.JwtTokenProvider;
import com.example.cinemabookingservice.user.application.dto.UserResponse;
import com.example.cinemabookingservice.user.domain.RefreshToken;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.UserRole;
import com.example.cinemabookingservice.user.domain.exception.TokenRevokedException;
import com.example.cinemabookingservice.user.domain.exception.UserAlreadyExistsException;
import com.example.cinemabookingservice.user.domain.exception.UserNotFoundException;
import com.example.cinemabookingservice.user.domain.repository.RefreshTokenRepository;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email này đã được sử dụng");
        }
        if (request.getPhone() != null && !request.getPhone().isBlank() && userRepository.existsByPhone(request.getPhone())) {
            throw new UserAlreadyExistsException("Số điện thoại này đã được sử dụng");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return createAuthResponse(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Email hoặc mật khẩu không chính xác");
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BadCredentialsException("Tài khoản của bạn đã bị khóa");
        }

        return createAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new TokenRevokedException("Refresh token không hợp lệ hoặc không tồn tại"));

        if (!refreshToken.isValid()) {
            throw new TokenRevokedException("Refresh token đã hết hạn hoặc bị thu hồi");
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng của token này"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .user(UserResponse.fromDomain(user))
                .build();
    }

    @Transactional
    public void logout(Long userId) {
        if (userId != null) {
            refreshTokenRepository.revokeAllByUserId(userId);
        }
    }

    private AuthResponse createAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken();

        LocalDateTime expiresAt = LocalDateTime.now().plusNanos(jwtTokenProvider.getRefreshTokenExpirationMs() * 1_000_000);

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(user.getId())
                .token(refreshTokenStr)
                .expiresAt(expiresAt)
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .user(UserResponse.fromDomain(user))
                .build();
    }
}
