package com.example.cinemabookingservice.booking.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCheckInRequest {

    @NotBlank(message = "Mã vé hoặc dữ liệu mã QR không được để trống")
    private String ticketCodeOrQr;
}