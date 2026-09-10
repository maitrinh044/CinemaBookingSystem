package com.example.cinemabookingservice.showtime.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeRepository;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.entity.ShowtimeEntity;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.mapper.ShowtimeEntityMapper;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.repository.SpringDataShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ShowtimeRepositoryAdapter implements ShowtimeRepository {

    private final SpringDataShowtimeRepository springDataShowtimeRepository;
    private final ShowtimeEntityMapper showtimeEntityMapper;

    @Override
    public List<Showtime> findAll() {
        return springDataShowtimeRepository.findAll().stream()
                .map(showtimeEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Showtime> findById(Long id) {
        return springDataShowtimeRepository.findById(id).map(showtimeEntityMapper::toDomain);
    }

    @Override
    public List<Showtime> findByFilters(Long movieId, List<Long> roomIds, LocalDateTime fromTime, LocalDateTime toTime, ShowtimeStatus status) {
        List<Long> rooms = (roomIds != null && roomIds.isEmpty()) ? null : roomIds;
        return springDataShowtimeRepository.findByFilters(movieId, rooms, fromTime, toTime, status).stream()
                .map(showtimeEntityMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsOverlapping(Long roomId, LocalDateTime startTime, LocalDateTime endTime, Long excludeShowtimeId) {
        return springDataShowtimeRepository.existsOverlapping(roomId, startTime, endTime, excludeShowtimeId);
    }

    @Override
    public Showtime save(Showtime showtime) {
        ShowtimeEntity entity = showtimeEntityMapper.toEntity(showtime);
        ShowtimeEntity saved = springDataShowtimeRepository.save(entity);
        return showtimeEntityMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        springDataShowtimeRepository.deleteById(id);
    }
}