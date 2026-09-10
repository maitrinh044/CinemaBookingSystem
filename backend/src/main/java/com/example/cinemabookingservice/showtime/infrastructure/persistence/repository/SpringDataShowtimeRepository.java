package com.example.cinemabookingservice.showtime.infrastructure.persistence.repository;

import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
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
           "AND (:excludeId IS NULL OR s.id != :excludeId) " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    boolean existsOverlapping(
            @Param("roomId") Long roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId
    );

    @Query("SELECT s FROM ShowtimeEntity s WHERE " +
           "(:movieId IS NULL OR s.movieId = :movieId) AND " +
           "(:roomIds IS NULL OR s.roomId IN :roomIds) AND " +
           "(:fromTime IS NULL OR s.startTime >= :fromTime) AND " +
           "(:toTime IS NULL OR s.startTime <= :toTime) AND " +
           "(:status IS NULL OR s.status = :status) " +
           "ORDER BY s.startTime ASC")
    List<ShowtimeEntity> findByFilters(
            @Param("movieId") Long movieId,
            @Param("roomIds") List<Long> roomIds,
            @Param("fromTime") LocalDateTime fromTime,
            @Param("toTime") LocalDateTime toTime,
            @Param("status") ShowtimeStatus status
    );
}