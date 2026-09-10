package com.example.cinemabookingservice.cinema.application.dto.seat;

import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.domain.SeatType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatResponse {
    private Long id;
    private Long roomId;
    private String rowLabel;
    private Integer seatNumber;
    private String seatCode;
    private SeatType seatType;
    private Boolean isActive;

    public static SeatResponse fromDomain(Seat seat) {
        if (seat == null) return null;
        return SeatResponse.builder()
                .id(seat.getId())
                .roomId(seat.getRoomId())
                .rowLabel(seat.getRowLabel())
                .seatNumber(seat.getSeatNumber())
                .seatCode(seat.getSeatCode())
                .seatType(seat.getSeatType())
                .isActive(seat.getIsActive())
                .build();
    }
}