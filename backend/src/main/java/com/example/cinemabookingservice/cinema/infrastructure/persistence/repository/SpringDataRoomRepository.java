package com.example.cinemabookingservice.cinema.infrastructure.persistence.repository;

import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataRoomRepository extends JpaRepository<RoomEntity, Long> {
    List<RoomEntity> findByCinemaId(Long cinemaId);
}