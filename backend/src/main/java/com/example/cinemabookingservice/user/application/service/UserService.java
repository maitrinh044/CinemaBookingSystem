package com.example.cinemabookingservice.user.application.service;

import com.example.cinemabookingservice.user.application.dto.ChangePasswordRequest;
import com.example.cinemabookingservice.user.application.dto.UpdateProfileRequest;
import com.example.cinemabookingservice.user.application.dto.UserResponse;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.exception.UserAlreadyExistsException;
import com.example.cinemabookingservice.user.domain.exception.UserNotFoundException;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với email: " + email));
        return UserResponse.fromDomain(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với email: " + email));

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            if (!request.getPhone().equals(user.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
                throw new UserAlreadyExistsException("Số điện thoại này đã được sử dụng bởi tài khoản khác");
            }
            user.setPhone(request.getPhone());
        }

        user.setFullName(request.getFullName());
        user.setUpdatedAt(LocalDateTime.now());

        User updated = userRepository.save(user);
        return UserResponse.fromDomain(updated);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với email: " + email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Mật khẩu hiện tại không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
