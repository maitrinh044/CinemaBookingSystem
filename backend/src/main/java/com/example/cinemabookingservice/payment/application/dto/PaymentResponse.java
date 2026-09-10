package com.example.cinemabookingservice.payment.application.dto;

import com.example.cinemabookingservice.payment.domain.PaymentMethod;
import com.example.cinemabookingservice.payment.domain.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String bookingCode;
    private String transactionId;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private BigDecimal amount;
    private String paymentUrl;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}