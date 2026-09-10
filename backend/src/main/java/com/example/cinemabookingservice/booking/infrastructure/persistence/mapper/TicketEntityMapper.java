package com.example.cinemabookingservice.booking.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.booking.domain.Ticket;
import com.example.cinemabookingservice.booking.infrastructure.persistence.entity.TicketEntity;
import org.springframework.stereotype.Component;

@Component
public class TicketEntityMapper {

    public Ticket toDomain(TicketEntity entity) {
        if (entity == null) return null;
        return Ticket.builder()
                .id(entity.getId())
                .ticketCode(entity.getTicketCode())
                .bookingSeatId(entity.getBookingSeatId())
                .qrCode(entity.getQrCode())
                .status(entity.getStatus())
                .checkedInAt(entity.getCheckedInAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public TicketEntity toEntity(Ticket domain) {
        if (domain == null) return null;
        return TicketEntity.builder()
                .id(domain.getId())
                .ticketCode(domain.getTicketCode())
                .bookingSeatId(domain.getBookingSeatId())
                .qrCode(domain.getQrCode())
                .status(domain.getStatus())
                .checkedInAt(domain.getCheckedInAt())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}