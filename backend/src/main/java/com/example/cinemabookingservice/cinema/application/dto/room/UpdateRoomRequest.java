package com.example.cinemabookingservice.cinema.application.dto.room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRoomRequest {

    @NotBlank(message = "Tên phòng chiếu không được để trống")
    private String name;

    @NotNull(message = "Tổng số hàng ghế không được để trống")
    @Min(value = 1, message = "Phòng chiếu phải có ít nhất 1 hàng ghế")
    private Integer totalRows;

    @NotNull(message = "Tổng số cột ghế không được để trống")
    @Min(value = 1, message = "Mỗi hàng phải có ít nhất 1 ghế")
    private Integer totalColumns;

    private Boolean isActive;
}