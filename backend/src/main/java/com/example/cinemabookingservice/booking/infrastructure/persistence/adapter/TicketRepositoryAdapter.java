package com.example.cinemabookingservice.booking.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.booking.domain.Ticket;
import com.example.cinemabookingservice.booking.domain.repository.TicketRepository;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.TicketEntity;
import com.example.cinemabookingservice.booking.infrastructure.persistence.mapper.TicketEntityMapper;
import com.example.cinemabookingservice.booking.infrastructure.persistence.repository.SpringDataTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TicketRepositoryAdapter implements TicketRepository {

    private final SpringDataTicketRepository springDataTicketRepository;
    private final TicketEntityMapper ticketEntityMapper;

    @Override
    public Optional<Ticket> findById(Long id) {
        return springDataTicketRepository.findById(id).map(ticketEntityMapper::toDomain);
    }

    @Override
    public Optional<Ticket> findByTicketCode(String ticketCode) {
        return springDataTicketRepository.findByTicketCode(ticketCode).map(ticketEntityMapper::toDomain);
    }

    @Override
    public Optional<Ticket> findByBookingSeatId(Long bookingSeatId) {
        return springDataTicketRepository.findByBookingSeatId(bookingSeatId).map(ticketEntityMapper::toDomain);
    }

    @Override
    public List<Ticket> findByBookingSeatIds(List<Long> bookingSeatIds) {
        return springDataTicketRepository.findByBookingSeatIdIn(bookingSeatIds).stream()
                .map(ticketEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Ticket save(Ticket ticket) {
        TicketEntity entity = ticketEntityMapper.toEntity(ticket);
        TicketEntity saved = springDataTicketRepository.save(entity);
        return ticketEntityMapper.toDomain(saved);
    }

    @Override
    public List<Ticket> saveAll(List<Ticket> tickets) {
        List<TicketEntity> entities = tickets.stream().map(ticketEntityMapper::toEntity).toList();
        return springDataTicketRepository.saveAll(entities).stream()
                .map(ticketEntityMapper::toDomain)
                .toList();
    }
}