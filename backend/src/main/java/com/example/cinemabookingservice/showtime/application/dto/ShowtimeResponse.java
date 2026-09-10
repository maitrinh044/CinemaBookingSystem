package com.example.cinemabookingservice.showtime.application.dto;

import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeResponse {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private Long roomId;
    private String roomName;
    private Long cinemaId;
    private String cinemaName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal basePrice;
    private ShowtimeStatus status;
    private List<ShowtimeSeatPriceDto> seatPrices;
    private LocalDateTime createdAt;

    public static ShowtimeResponse of(
            Showtime showtime,
            String movieTitle,
            String moviePosterUrl,
            String roomName,
            Long cinemaId,
            String cinemaName,
            List<ShowtimeSeatPriceDto> seatPrices
    ) {
        return ShowtimeResponse.builder()
                .id(showtime.getId())
                .movieId(showtime.getMovieId())
                .movieTitle(movieTitle)
                .moviePosterUrl(moviePosterUrl)
                .roomId(showtime.getRoomId())
                .roomName(roomName)
                .cinemaId(cinemaId)
                .cinemaName(cinemaName)
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .basePrice(showtime.getBasePrice())
                .status(showtime.getStatus())
                .seatPrices(seatPrices)
                .createdAt(showtime.getCreatedAt())
                .build();
    }
}