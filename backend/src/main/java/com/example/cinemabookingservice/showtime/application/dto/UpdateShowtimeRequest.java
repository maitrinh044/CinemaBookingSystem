package com.example.cinemabookingservice.showtime.application.dto;

import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateShowtimeRequest {

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @DecimalMin(value = "0.0", inclusive = false, message = "Giá vé cơ sở phải lớn hơn 0")
    private BigDecimal basePrice;

    private ShowtimeStatus status;

    private List<ShowtimeSeatPriceDto> customSeatPrices;
}