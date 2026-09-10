package com.example.cinemabookingservice.showtime.application.dto;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateShowtimeRequest {

    @NotNull(message = "ID bộ phim không được để trống")
    private Long movieId;

    @NotNull(message = "ID phòng chiếu không được để trống")
    private Long roomId;

    @NotNull(message = "Thời gian bắt đầu chiếu không được để trống")
    private LocalDateTime startTime;

    // Nếu không nhập endTime, hệ thống tự động tính: startTime + duration_minutes + 15 phút
    private LocalDateTime endTime;

    @NotNull(message = "Giá vé cơ sở không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá vé cơ sở phải lớn hơn 0")
    private BigDecimal basePrice;

    // Danh sách giá tùy biến theo loại ghế (nếu có)
    private List<ShowtimeSeatPriceDto> customSeatPrices;
}