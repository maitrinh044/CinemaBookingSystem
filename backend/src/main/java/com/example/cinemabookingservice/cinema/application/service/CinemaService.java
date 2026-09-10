package com.example.cinemabookingservice.cinema.application.service;

import com.example.cinemabookingservice.cinema.application.dto.cinema.CinemaResponse;
import com.example.cinemabookingservice.cinema.application.dto.cinema.CreateCinemaRequest;
import com.example.cinemabookingservice.cinema.application.dto.cinema.UpdateCinemaRequest;
import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.domain.exception.CinemaNotFoundException;
import com.example.cinemabookingservice.cinema.domain.repository.CinemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CinemaService {

    private final CinemaRepository cinemaRepository;

    @Transactional(readOnly = true)
    public List<CinemaResponse> getAllCinemas(String city) {
        List<Cinema> cinemas;
        if (city != null && !city.isBlank()) {
            cinemas = cinemaRepository.findByCity(city.trim());
        } else {
            cinemas = cinemaRepository.findAll();
        }
        return cinemas.stream().map(CinemaResponse::fromDomain).toList();
    }

    @Transactional(readOnly = true)
    public CinemaResponse getCinemaById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new CinemaNotFoundException("Không tìm thấy cụm rạp với ID: " + id));
        return CinemaResponse.fromDomain(cinema);
    }

    @Transactional
    public CinemaResponse createCinema(CreateCinemaRequest request) {
        Cinema cinema = Cinema.builder()
                .name(request.getName().trim())
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .district(request.getDistrict() != null ? request.getDistrict().trim() : null)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Cinema saved = cinemaRepository.save(cinema);
        return CinemaResponse.fromDomain(saved);
    }

    @Transactional
    public CinemaResponse updateCinema(Long id, UpdateCinemaRequest request) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new CinemaNotFoundException("Không tìm thấy cụm rạp với ID: " + id));

        cinema.setName(request.getName().trim());
        cinema.setAddress(request.getAddress().trim());
        cinema.setCity(request.getCity().trim());
        if (request.getDistrict() != null) cinema.setDistrict(request.getDistrict().trim());
        if (request.getPhone() != null) cinema.setPhone(request.getPhone().trim());
        if (request.getIsActive() != null) cinema.setIsActive(request.getIsActive());
        cinema.setUpdatedAt(LocalDateTime.now());

        Cinema updated = cinemaRepository.save(cinema);
        return CinemaResponse.fromDomain(updated);
    }

    @Transactional
    public void deleteCinema(Long id) {
        if (cinemaRepository.findById(id).isEmpty()) {
            throw new CinemaNotFoundException("Không tìm thấy cụm rạp với ID: " + id);
        }
        cinemaRepository.deleteById(id);
    }
}