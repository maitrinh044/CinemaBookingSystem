package com.example.cinemabookingservice.payment.application.dto;

import com.example.cinemabookingservice.payment.domain.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {

    @NotNull(message = "Mã đơn hàng bookingId không được để trống")
    private Long bookingId;

    @NotNull(message = "Phương thức thanh toán paymentMethod không được để trống")
    private PaymentMethod paymentMethod;
}