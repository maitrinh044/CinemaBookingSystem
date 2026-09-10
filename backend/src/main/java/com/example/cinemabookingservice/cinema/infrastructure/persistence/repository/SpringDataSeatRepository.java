package com.example.cinemabookingservice.cinema.infrastructure.persistence.repository;

import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.SeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataSeatRepository extends JpaRepository<SeatEntity, Long> {
    List<SeatEntity> findByRoomIdOrderByRowLabelAscSeatNumberAsc(Long roomId);
    void deleteByRoomId(Long roomId);
}