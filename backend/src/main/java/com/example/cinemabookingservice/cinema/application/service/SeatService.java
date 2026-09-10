package com.example.cinemabookingservice.cinema.application.service;

import com.example.cinemabookingservice.cinema.application.dto.seat.GenerateSeatsRequest;
import com.example.cinemabookingservice.cinema.application.dto.seat.SeatResponse;
import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.cinema.domain.exception.RoomNotFoundException;
import com.example.cinemabookingservice.cinema.domain.repository.RoomRepository;
import com.example.cinemabookingservice.cinema.domain.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByRoomId(Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng chiếu với ID: " + roomId));

        return seatRepository.findByRoomId(roomId).stream()
                .map(SeatResponse::fromDomain)
                .toList();
    }

    @Transactional
    public List<SeatResponse> generateSeats(Long roomId, GenerateSeatsRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng chiếu với ID: " + roomId));

        // Xóa ghế cũ của phòng nếu có
        seatRepository.deleteByRoomId(roomId);

        Set<String> vipRows = new HashSet<>();
        if (request != null && request.getVipRows() != null) {
            request.getVipRows().forEach(r -> vipRows.add(r.toUpperCase().trim()));
        }

        Set<String> coupleRows = new HashSet<>();
        if (request != null && request.getCoupleRows() != null) {
            request.getCoupleRows().forEach(r -> coupleRows.add(r.toUpperCase().trim()));
        }

        List<Seat> seatsToSave = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int r = 0; r < room.getTotalRows(); r++) {
            char rowChar = (char) ('A' + r);
            String rowLabel = String.valueOf(rowChar);

            SeatType rowType = SeatType.NORMAL;
            if (coupleRows.contains(rowLabel)) {
                rowType = SeatType.COUPLE;
            } else if (vipRows.contains(rowLabel)) {
                rowType = SeatType.VIP;
            }

            for (int c = 1; c <= room.getTotalColumns(); c++) {
                Seat seat = Seat.builder()
                        .roomId(roomId)
                        .rowLabel(rowLabel)
                        .seatNumber(c)
                        .seatType(rowType)
                        .isActive(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                seatsToSave.add(seat);
            }
        }

        List<Seat> savedSeats = seatRepository.saveAll(seatsToSave);
        return savedSeats.stream().map(SeatResponse::fromDomain).toList();
    }
}