package com.example.cinemabookingservice.showtime.infrastructure.persistence.repository;

import com.example.cinemabookingservice.showtime.infrastructure.persistence.entity.ShowtimeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SpringDataShowtimeRepository extends JpaRepository<ShowtimeEntity, Long> {

    @Query("SELECT COUNT(s) > 0 FROM ShowtimeEntity s " +
           "WHERE s.roomId = :roomId " +
           "AND s.status = 'ACTIVE' " +
           "AND (:excludeId = 0L OR s.id != :excludeId) " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    boolean existsOverlapping(
            @Param("roomId") Long roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId
    );

    List<ShowtimeEntity> findAllByOrderByStartTimeAsc();
}