package com.example.cinemabookingservice.user.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import com.example.cinemabookingservice.user.infrastructure.persistence.entity.UserEntity;
import com.example.cinemabookingservice.user.infrastructure.persistence.mapper.UserEntityMapper;
import com.example.cinemabookingservice.user.infrastructure.persistence.repository.SpringDataUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final SpringDataUserRepository springDataUserRepository;
    private final UserEntityMapper userEntityMapper;

    @Override
    public Optional<User> findById(Long id) {
        return springDataUserRepository.findById(id).map(userEntityMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return springDataUserRepository.findByEmail(email).map(userEntityMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return springDataUserRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        if (phone == null || phone.isBlank()) return false;
        return springDataUserRepository.existsByPhone(phone);
    }

    @Override
    public User save(User user) {
        UserEntity entity = userEntityMapper.toEntity(user);
        UserEntity saved = springDataUserRepository.save(entity);
        return userEntityMapper.toDomain(saved);
    }
}
