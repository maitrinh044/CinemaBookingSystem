package com.example.cinemabookingservice.cinema.application.dto.room;

import com.example.cinemabookingservice.cinema.application.dto.seat.SeatResponse;
import com.example.cinemabookingservice.cinema.domain.Room;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDetailResponse {
    private RoomResponse room;
    private List<SeatResponse> seats;

    public static RoomDetailResponse of(Room room, List<SeatResponse> seats) {
        return RoomDetailResponse.builder()
                .room(RoomResponse.fromDomain(room))
                .seats(seats)
                .build();
    }
}