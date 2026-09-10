package com.example.cinemabookingservice.booking.infrastructure.persistence.repository;

import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpringDataTicketRepository extends JpaRepository<TicketEntity, Long> {
    Optional<TicketEntity> findByTicketCode(String ticketCode);
    Optional<TicketEntity> findByBookingSeatId(Long bookingSeatId);
    List<TicketEntity> findByBookingSeatIdIn(List<Long> bookingSeatIds);
}