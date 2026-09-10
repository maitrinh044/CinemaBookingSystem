package com.example.cinemabookingservice.cinema.application.dto.room;

import com.example.cinemabookingservice.cinema.domain.Room;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long id;
    private Long cinemaId;
    private String name;
    private Integer totalRows;
    private Integer totalColumns;
    private Integer totalSeats;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static RoomResponse fromDomain(Room room) {
        if (room == null) return null;
        return RoomResponse.builder()
                .id(room.getId())
                .cinemaId(room.getCinemaId())
                .name(room.getName())
                .totalRows(room.getTotalRows())
                .totalColumns(room.getTotalColumns())
                .totalSeats(room.calculateCapacity())
                .isActive(room.getIsActive())
                .createdAt(room.getCreatedAt())
                .build();
    }
}