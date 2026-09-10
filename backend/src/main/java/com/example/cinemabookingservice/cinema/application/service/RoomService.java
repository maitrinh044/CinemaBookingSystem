package com.example.cinemabookingservice.cinema.application.service;

import com.example.cinemabookingservice.cinema.application.dto.room.CreateRoomRequest;
import com.example.cinemabookingservice.cinema.application.dto.room.RoomDetailResponse;
import com.example.cinemabookingservice.cinema.application.dto.room.RoomResponse;
import com.example.cinemabookingservice.cinema.application.dto.room.UpdateRoomRequest;
import com.example.cinemabookingservice.cinema.application.dto.seat.SeatResponse;
import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.domain.exception.CinemaNotFoundException;
import com.example.cinemabookingservice.cinema.domain.exception.RoomNotFoundException;
import com.example.cinemabookingservice.cinema.domain.repository.CinemaRepository;
import com.example.cinemabookingservice.cinema.domain.repository.RoomRepository;
import com.example.cinemabookingservice.cinema.domain.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;

    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByCinemaId(Long cinemaId) {
        cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new CinemaNotFoundException("Không tìm thấy cụm rạp với ID: " + cinemaId));

        return roomRepository.findByCinemaId(cinemaId).stream()
                .map(RoomResponse::fromDomain)
                .toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng chiếu với ID: " + id));
        return RoomResponse.fromDomain(room);
    }

    @Transactional(readOnly = true)
    public RoomDetailResponse getRoomDetail(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng chiếu với ID: " + id));

        List<SeatResponse> seats = seatRepository.findByRoomId(id).stream()
                .map(SeatResponse::fromDomain)
                .toList();

        return RoomDetailResponse.of(room, seats);
    }

    @Transactional
    public RoomResponse createRoom(Long cinemaId, CreateRoomRequest request) {
        cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new CinemaNotFoundException("Không tìm thấy cụm rạp với ID: " + cinemaId));

        Room room = Room.builder()
                .cinemaId(cinemaId)
                .name(request.getName().trim())
                .totalRows(request.getTotalRows())
                .totalColumns(request.getTotalColumns())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Room saved = roomRepository.save(room);
        return RoomResponse.fromDomain(saved);
    }

    @Transactional
    public RoomResponse updateRoom(Long id, UpdateRoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng chiếu với ID: " + id));

        room.setName(request.getName().trim());
        room.setTotalRows(request.getTotalRows());
        room.setTotalColumns(request.getTotalColumns());
        if (request.getIsActive() != null) room.setIsActive(request.getIsActive());
        room.setUpdatedAt(LocalDateTime.now());

        Room updated = roomRepository.save(room);
        return RoomResponse.fromDomain(updated);
    }
}