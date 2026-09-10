package com.example.cinemabookingservice.payment.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.payment.domain.Payment;
import com.example.cinemabookingservice.payment.infrastructure.persistence.entity.PaymentEntity;
import org.springframework.stereotype.Component;

@Component
public class PaymentEntityMapper {

    public Payment toDomain(PaymentEntity entity) {
        if (entity == null) return null;
        return Payment.builder()
                .id(entity.getId())
                .bookingId(entity.getBookingId())
                .transactionId(entity.getTransactionId())
                .paymentMethod(entity.getPaymentMethod())
                .status(entity.getStatus())
                .amount(entity.getAmount())
                .paidAt(entity.getPaidAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public PaymentEntity toEntity(Payment domain) {
        if (domain == null) return null;
        return PaymentEntity.builder()
                .id(domain.getId())
                .bookingId(domain.getBookingId())
                .transactionId(domain.getTransactionId())
                .paymentMethod(domain.getPaymentMethod())
                .status(domain.getStatus())
                .amount(domain.getAmount())
                .paidAt(domain.getPaidAt())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}