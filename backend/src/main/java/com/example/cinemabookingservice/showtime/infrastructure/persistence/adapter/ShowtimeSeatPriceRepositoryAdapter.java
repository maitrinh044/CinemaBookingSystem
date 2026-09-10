package com.example.cinemabookingservice.showtime.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeSeatPriceRepository;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.entity.ShowtimeSeatPriceEntity;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.mapper.ShowtimeSeatPriceEntityMapper;
import com.example.cinemabookingservice.showtime.infrastructure.persistence.repository.SpringDataShowtimeSeatPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ShowtimeSeatPriceRepositoryAdapter implements ShowtimeSeatPriceRepository {

    private final SpringDataShowtimeSeatPriceRepository springDataShowtimeSeatPriceRepository;
    private final ShowtimeSeatPriceEntityMapper showtimeSeatPriceEntityMapper;

    @Override
    public List<ShowtimeSeatPrice> findByShowtimeId(Long showtimeId) {
        return springDataShowtimeSeatPriceRepository.findByShowtimeId(showtimeId).stream()
                .map(showtimeSeatPriceEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<ShowtimeSeatPrice> findByShowtimeIdAndSeatType(Long showtimeId, SeatType seatType) {
        return springDataShowtimeSeatPriceRepository.findByShowtimeIdAndSeatType(showtimeId, seatType)
                .map(showtimeSeatPriceEntityMapper::toDomain);
    }

    @Override
    public List<ShowtimeSeatPrice> saveAll(List<ShowtimeSeatPrice> prices) {
        List<ShowtimeSeatPriceEntity> entities = prices.stream()
                .map(showtimeSeatPriceEntityMapper::toEntity)
                .toList();
        return springDataShowtimeSeatPriceRepository.saveAll(entities).stream()
                .map(showtimeSeatPriceEntityMapper::toDomain)
                .toList();
    }

    @Override
    @Transactional
    public void deleteByShowtimeId(Long showtimeId) {
        springDataShowtimeSeatPriceRepository.deleteByShowtimeId(showtimeId);
    }
}