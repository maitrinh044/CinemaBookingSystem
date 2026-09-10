package com.example.cinemabookingservice.user.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.user.domain.RefreshToken;
import com.example.cinemabookingservice.user.domain.repository.RefreshTokenRepository;
import com.example.cinemabookingservice.user.infrastructure.persistence.entity.RefreshTokenEntity;
import com.example.cinemabookingservice.user.infrastructure.persistence.mapper.RefreshTokenEntityMapper;
import com.example.cinemabookingservice.user.infrastructure.persistence.repository.SpringDataRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RefreshTokenRepositoryAdapter implements RefreshTokenRepository {

    private final SpringDataRefreshTokenRepository springDataRefreshTokenRepository;
    private final RefreshTokenEntityMapper refreshTokenEntityMapper;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return springDataRefreshTokenRepository.findByToken(token).map(refreshTokenEntityMapper::toDomain);
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        RefreshTokenEntity entity = refreshTokenEntityMapper.toEntity(refreshToken);
        RefreshTokenEntity saved = springDataRefreshTokenRepository.save(entity);
        return refreshTokenEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void revokeAllByUserId(Long userId) {
        springDataRefreshTokenRepository.revokeAllByUserId(userId);
    }
}
