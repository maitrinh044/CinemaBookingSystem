package com.example.cinemabookingservice.cinema.application.dto.seat;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateSeatsRequest {
    // Danh sách các hàng ghế VIP, ví dụ: ["E", "F", "G", "H"]
    private List<String> vipRows;

    // Danh sách các hàng ghế Couple, ví dụ: ["J"]
    private List<String> coupleRows;
}