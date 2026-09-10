package com.example.cinemabookingservice.payment.infrastructure.persistence.repository;

import com.example.cinemabookingservice.payment.infrastructure.persistence.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataPaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findByBookingId(Long bookingId);
    Optional<PaymentEntity> findByTransactionId(String transactionId);
}