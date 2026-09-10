package com.example.cinemabookingservice.cinema.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.domain.repository.SeatRepository;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.SeatEntity;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.mapper.SeatEntityMapper;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.repository.SpringDataSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SeatRepositoryAdapter implements SeatRepository {

    private final SpringDataSeatRepository springDataSeatRepository;
    private final SeatEntityMapper seatEntityMapper;

    @Override
    public List<Seat> findByRoomId(Long roomId) {
        return springDataSeatRepository.findByRoomIdOrderByRowLabelAscSeatNumberAsc(roomId).stream()
                .map(seatEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Seat> findById(Long id) {
        return springDataSeatRepository.findById(id).map(seatEntityMapper::toDomain);
    }

    @Override
    public List<Seat> saveAll(List<Seat> seats) {
        List<SeatEntity> entities = seats.stream().map(seatEntityMapper::toEntity).toList();
        return springDataSeatRepository.saveAll(entities).stream()
                .map(seatEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Seat save(Seat seat) {
        SeatEntity entity = seatEntityMapper.toEntity(seat);
        SeatEntity saved = springDataSeatRepository.save(entity);
        return seatEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void deleteByRoomId(Long roomId) {
        springDataSeatRepository.deleteByRoomId(roomId);
    }
}