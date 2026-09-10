package com.example.cinemabookingservice.showtime.domain;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Showtime {
    private Long id;
    private Long movieId;
    private Long roomId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal basePrice;
    private ShowtimeStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public boolean isFinished() {
        return status == ShowtimeStatus.FINISHED || (endTime != null && endTime.isBefore(LocalDateTime.now()));
    }
}