package com.example.cinemabookingservice.user.domain.repository;

import com.example.cinemabookingservice.user.domain.User;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    User save(User user);
}
