package com.example.cinemabookingservice.showtime.application.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSeatsMapResponse {
    private ShowtimeResponse showtime;
    private Integer totalSeats;
    private Integer availableSeats;
    private List<ShowtimeSeatItemDto> seats;
}