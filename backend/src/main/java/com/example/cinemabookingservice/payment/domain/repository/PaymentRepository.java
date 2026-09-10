package com.example.cinemabookingservice.payment.domain.repository;

import com.example.cinemabookingservice.payment.domain.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findById(Long id);
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findAll();
}