package com.example.cinemabookingservice.payment.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.payment.domain.Payment;
import com.example.cinemabookingservice.payment.domain.repository.PaymentRepository;
import com.example.cinemabookingservice.payment.infrastructure.persistence.entity.PaymentEntity;
import com.example.cinemabookingservice.payment.infrastructure.persistence.mapper.PaymentEntityMapper;
import com.example.cinemabookingservice.payment.infrastructure.persistence.repository.SpringDataPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PaymentRepositoryAdapter implements PaymentRepository {

    private final SpringDataPaymentRepository springRepo;
    private final PaymentEntityMapper mapper;

    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity = mapper.toEntity(payment);
        PaymentEntity saved = springRepo.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Payment> findById(Long id) {
        return springRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Payment> findByBookingId(Long bookingId) {
        return springRepo.findByBookingId(bookingId).map(mapper::toDomain);
    }

    @Override
    public Optional<Payment> findByTransactionId(String transactionId) {
        return springRepo.findByTransactionId(transactionId).map(mapper::toDomain);
    }

    @Override
    public List<Payment> findAll() {
        return springRepo.findAll().stream().map(mapper::toDomain).toList();
    }
}