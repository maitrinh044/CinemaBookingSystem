package com.example.cinemabookingservice.user.domain.repository;

import com.example.cinemabookingservice.user.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepository {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken save(RefreshToken refreshToken);
    void revokeAllByUserId(Long userId);
}
