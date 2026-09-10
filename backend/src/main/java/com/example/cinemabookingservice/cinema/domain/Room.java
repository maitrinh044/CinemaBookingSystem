package com.example.cinemabookingservice.cinema.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    private Long id;
    private Long cinemaId;
    private String name;
    private Integer totalRows;
    private Integer totalColumns;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int calculateCapacity() {
        if (totalRows == null || totalColumns == null) return 0;
        return totalRows * totalColumns;
    }
}