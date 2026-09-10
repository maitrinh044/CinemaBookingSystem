package com.example.cinemabookingservice.cinema.infrastructure.persistence.adapter;

import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.domain.repository.CinemaRepository;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.entity.CinemaEntity;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.mapper.CinemaEntityMapper;
import com.example.cinemabookingservice.cinema.infrastructure.persistence.repository.SpringDataCinemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CinemaRepositoryAdapter implements CinemaRepository {

    private final SpringDataCinemaRepository springDataCinemaRepository;
    private final CinemaEntityMapper cinemaEntityMapper;

    @Override
    public List<Cinema> findAll() {
        return springDataCinemaRepository.findAll().stream()
                .map(cinemaEntityMapper::toDomain)
                .toList();
    }

    @Override
    public List<Cinema> findByCity(String city) {
        return springDataCinemaRepository.findByCityIgnoreCase(city).stream()
                .map(cinemaEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Cinema> findById(Long id) {
        return springDataCinemaRepository.findById(id).map(cinemaEntityMapper::toDomain);
    }

    @Override
    public Cinema save(Cinema cinema) {
        CinemaEntity entity = cinemaEntityMapper.toEntity(cinema);
        CinemaEntity saved = springDataCinemaRepository.save(entity);
        return cinemaEntityMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        springDataCinemaRepository.deleteById(id);
    }
}