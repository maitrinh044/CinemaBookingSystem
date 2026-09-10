package com.example.cinemabookingservice.movie.infrastructure.persistence.mapper;

import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.infrastructure.persistence.entity.GenreEntity;

public final class GenreEntityMapper {

    private GenreEntityMapper() {
    }

    public static Genre toDomain(GenreEntity entity) {
        return new Genre(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public static GenreEntity toEntity(Genre genre) {

        GenreEntity entity = new GenreEntity();

        entity.setId(genre.getId());
        entity.setName(genre.getName());
        entity.setDescription(genre.getDescription());

        return entity;
    }
}