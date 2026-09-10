package com.example.cinemabookingservice.cinema.application.dto.cinema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCinemaRequest {

    @NotBlank(message = "Tên cụm rạp không được để trống")
    @Size(max = 150, message = "Tên cụm rạp tối đa 150 ký tự")
    private String name;

    @NotBlank(message = "Địa chỉ rạp không được để trống")
    private String address;

    @NotBlank(message = "Thành phố không được để trống")
    @Size(max = 100, message = "Tên thành phố tối đa 100 ký tự")
    private String city;

    private String district;

    private String phone;
}