package com.example.cinemabookingservice.booking.domain.repository;

import com.example.cinemabookingservice.booking.domain.Ticket;

import java.util.List;
import java.util.Optional;

public interface TicketRepository {
    Optional<Ticket> findById(Long id);
    Optional<Ticket> findByTicketCode(String ticketCode);
    Optional<Ticket> findByBookingSeatId(Long bookingSeatId);
    List<Ticket> findByBookingSeatIds(List<Long> bookingSeatIds);
    Ticket save(Ticket ticket);
    List<Ticket> saveAll(List<Ticket> tickets);
}