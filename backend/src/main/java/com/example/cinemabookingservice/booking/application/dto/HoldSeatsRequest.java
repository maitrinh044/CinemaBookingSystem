package com.example.cinemabookingservice.booking.application.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoldSeatsRequest {

    @NotNull(message = "ID suất chiếu không được để trống")
    private Long showtimeId;

    @NotEmpty(message = "Danh sách ghế chọn không được để trống")
    private List<Long> seatIds;
}