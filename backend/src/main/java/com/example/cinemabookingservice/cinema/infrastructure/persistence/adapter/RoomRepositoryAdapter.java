package com.example.cinemabookingservice.cinema.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.domain.repository.RoomRepository;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.RoomEntity;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.mapper.RoomEntityMapper;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.repository.SpringDataRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RoomRepositoryAdapter implements RoomRepository {

    private final SpringDataRoomRepository springDataRoomRepository;
    private final RoomEntityMapper roomEntityMapper;

    @Override
    public List<Room> findByCinemaId(Long cinemaId) {
        return springDataRoomRepository.findByCinemaId(cinemaId).stream()
                .map(roomEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Room> findById(Long id) {
        return springDataRoomRepository.findById(id).map(roomEntityMapper::toDomain);
    }

    @Override
    public Room save(Room room) {
        RoomEntity entity = roomEntityMapper.toEntity(room);
        RoomEntity saved = springDataRoomRepository.save(entity);
        return roomEntityMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        springDataRoomRepository.deleteById(id);
    }
}