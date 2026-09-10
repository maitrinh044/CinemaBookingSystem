package com.example.cinemabookingservice.cinema.application.dto.cinema;

import com.example.cinemabookingservice.cinema.domain.Cinema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CinemaResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String district;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static CinemaResponse fromDomain(Cinema cinema) {
        if (cinema == null) return null;
        return CinemaResponse.builder()
                .id(cinema.getId())
                .name(cinema.getName())
                .address(cinema.getAddress())
                .city(cinema.getCity())
                .district(cinema.getDistrict())
                .phone(cinema.getPhone())
                .isActive(cinema.getIsActive())
                .createdAt(cinema.getCreatedAt())
                .build();
    }
}