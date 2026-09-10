package com.example.cinemabookingservice.showtime.application.service;

import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingSeat;
import com.example.cinemabookingservice.booking.domain.BookingStatus;
import com.example.cinemabookingservice.booking.domain.repository.BookingRepository;
import com.example.cinemabookingservice.booking.domain.repository.BookingSeatRepository;
import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.cinema.domain.exception.RoomNotFoundException;
import com.example.cinemabookingservice.cinema.domain.repository.CinemaRepository;
import com.example.cinemabookingservice.cinema.domain.repository.RoomRepository;
import com.example.cinemabookingservice.cinema.domain.repository.SeatRepository;
import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.domain.exception.MovieNotFoundException;
import com.example.cinemabookingservice.movie.domain.repository.MovieRepository;
import com.example.cinemabookingservice.showtime.application.dto.*;
import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;
import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
import com.example.cinemabookingservice.showtime.domain.exception.ShowtimeNotFoundException;
import com.example.cinemabookingservice.showtime.domain.exception.ShowtimeOverlapException;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeRepository;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeSeatPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatPriceRepository showtimeSeatPriceRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesByFilters(Long movieId, Long cinemaId, LocalDate date, ShowtimeStatus status) {
        List<Long> roomIds = null;
        if (cinemaId != null) {
            List<Room> rooms = roomRepository.findByCinemaId(cinemaId);
            roomIds = rooms.stream().map(Room::getId).toList();
            if (roomIds.isEmpty()) {
                return Collections.emptyList();
            }
        }

        LocalDateTime fromTime = null;
        LocalDateTime toTime = null;
        if (date != null) {
            fromTime = date.atStartOfDay();
            toTime = date.atTime(LocalTime.MAX);
        }

        List<Showtime> showtimes = showtimeRepository.findByFilters(movieId, roomIds, fromTime, toTime, status);

        return showtimes.stream().map(this::buildShowtimeResponse).toList();
    }

    @Transactional(readOnly = true)
    public ShowtimeResponse getShowtimeById(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ShowtimeNotFoundException("Không tìm thấy suất chiếu với ID: " + id));
        return buildShowtimeResponse(showtime);
    }

    @Transactional(readOnly = true)
    public ShowtimeSeatsMapResponse getShowtimeSeatsMap(Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ShowtimeNotFoundException("Không tìm thấy suất chiếu với ID: " + showtimeId));

        ShowtimeResponse showtimeResponse = buildShowtimeResponse(showtime);

        // Bảng giá theo loại ghế
        Map<SeatType, BigDecimal> priceMap = getSeatPriceMap(showtime);

        // Danh sách ghế của phòng chiếu
        List<Seat> seats = seatRepository.findByRoomId(showtime.getRoomId());

        // Lấy danh sách các ghế đang bị khóa/đã bán của suất chiếu này
        List<BookingSeat> bookedSeats = bookingSeatRepository.findByShowtimeId(showtime.getId());
        Map<Long, String> seatStatusMap = new HashMap<>();

        for (BookingSeat bs : bookedSeats) {
            Optional<Booking> bOpt = bookingRepository.findById(bs.getBookingId());
            if (bOpt.isPresent()) {
                Booking b = bOpt.get();
                if (b.getStatus() == BookingStatus.CONFIRMED) {
                    seatStatusMap.put(bs.getSeatId(), "SOLD");
                } else if (b.getStatus() == BookingStatus.PENDING && !b.isExpired()) {
                    seatStatusMap.put(bs.getSeatId(), "HOLDING");
                }
            }
        }

        int availableCount = 0;
        List<ShowtimeSeatItemDto> seatItems = new ArrayList<>();

        for (Seat seat : seats) {
            BigDecimal price = priceMap.getOrDefault(seat.getSeatType(), showtime.getBasePrice());
            String seatStatus = seatStatusMap.getOrDefault(seat.getId(), "AVAILABLE");

            if ("AVAILABLE".equals(seatStatus)) {
                availableCount++;
            }

            seatItems.add(ShowtimeSeatItemDto.builder()
                    .seatId(seat.getId())
                    .rowLabel(seat.getRowLabel())
                    .seatNumber(seat.getSeatNumber())
                    .seatCode(seat.getSeatCode())
                    .seatType(seat.getSeatType())
                    .price(price)
                    .status(seatStatus)
                    .build());
        }

        return ShowtimeSeatsMapResponse.builder()
                .showtime(showtimeResponse)
                .totalSeats(seatItems.size())
                .availableSeats(availableCount)
                .seats(seatItems)
                .build();
    }

    @Transactional
    public ShowtimeResponse createShowtime(CreateShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new MovieNotFoundException(request.getMovieId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Không tìm thấy phòng chiếu với ID: " + request.getRoomId()));

        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = request.getEndTime();

        // Tự động tính thời gian kết thúc: startTime + thời lượng phim + 15 phút dọn phòng
        if (endTime == null) {
            int duration = movie.getDurationMinutes() > 0 ? movie.getDurationMinutes() : 120;
            endTime = startTime.plusMinutes(duration + 15);
        }

        if (endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("Thời gian kết thúc không thể trước thời gian bắt đầu");
        }

        // Kiểm tra chồng lấn giờ chiếu trong cùng phòng
        if (showtimeRepository.existsOverlapping(room.getId(), startTime, endTime, null)) {
            throw new ShowtimeOverlapException("Đã có suất chiếu khác trùng giờ trong phòng này (" + room.getName() + ")");
        }

        Showtime showtime = Showtime.builder()
                .movieId(movie.getId())
                .roomId(room.getId())
                .startTime(startTime)
                .endTime(endTime)
                .basePrice(request.getBasePrice())
                .status(ShowtimeStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Showtime savedShowtime = showtimeRepository.save(showtime);

        // Lưu bảng giá theo loại ghế
        saveSeatPrices(savedShowtime, request.getCustomSeatPrices());

        return buildShowtimeResponse(savedShowtime);
    }

    @Transactional
    public ShowtimeResponse updateShowtime(Long id, UpdateShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ShowtimeNotFoundException("Không tìm thấy suất chiếu với ID: " + id));

        LocalDateTime startTime = request.getStartTime() != null ? request.getStartTime() : showtime.getStartTime();
        LocalDateTime endTime = request.getEndTime() != null ? request.getEndTime() : showtime.getEndTime();

        // Kiểm tra chồng lấn nếu có thay đổi thời gian
        if (!startTime.equals(showtime.getStartTime()) || !endTime.equals(showtime.getEndTime())) {
            if (showtimeRepository.existsOverlapping(showtime.getRoomId(), startTime, endTime, showtime.getId())) {
                throw new ShowtimeOverlapException("Đã có suất chiếu khác trùng giờ trong phòng này");
            }
            showtime.setStartTime(startTime);
            showtime.setEndTime(endTime);
        }

        if (request.getBasePrice() != null) {
            showtime.setBasePrice(request.getBasePrice());
        }

        if (request.getStatus() != null) {
            showtime.setStatus(request.getStatus());
        }

        showtime.setUpdatedAt(LocalDateTime.now());
        Showtime updated = showtimeRepository.save(showtime);

        if (request.getCustomSeatPrices() != null) {
            showtimeSeatPriceRepository.deleteByShowtimeId(updated.getId());
            saveSeatPrices(updated, request.getCustomSeatPrices());
        }

        return buildShowtimeResponse(updated);
    }

    @Transactional
    public void deleteShowtime(Long id) {
        if (showtimeRepository.findById(id).isEmpty()) {
            throw new ShowtimeNotFoundException("Không tìm thấy suất chiếu với ID: " + id);
        }
        showtimeSeatPriceRepository.deleteByShowtimeId(id);
        showtimeRepository.deleteById(id);
    }

    private void saveSeatPrices(Showtime showtime, List<ShowtimeSeatPriceDto> customPrices) {
        List<ShowtimeSeatPrice> seatPricesToSave = new ArrayList<>();

        if (customPrices != null && !customPrices.isEmpty()) {
            for (ShowtimeSeatPriceDto dto : customPrices) {
                seatPricesToSave.add(ShowtimeSeatPrice.builder()
                        .showtimeId(showtime.getId())
                        .seatType(dto.getSeatType())
                        .price(dto.getPrice())
                        .build());
            }
        } else {
            BigDecimal base = showtime.getBasePrice();
            seatPricesToSave.add(ShowtimeSeatPrice.builder()
                    .showtimeId(showtime.getId())
                    .seatType(SeatType.NORMAL)
                    .price(base)
                    .build());
            seatPricesToSave.add(ShowtimeSeatPrice.builder()
                    .showtimeId(showtime.getId())
                    .seatType(SeatType.VIP)
                    .price(base.add(BigDecimal.valueOf(20000)))
                    .build());
            seatPricesToSave.add(ShowtimeSeatPrice.builder()
                    .showtimeId(showtime.getId())
                    .seatType(SeatType.COUPLE)
                    .price(base.multiply(BigDecimal.valueOf(2)))
                    .build());
        }

        showtimeSeatPriceRepository.saveAll(seatPricesToSave);
    }

    private Map<SeatType, BigDecimal> getSeatPriceMap(Showtime showtime) {
        List<ShowtimeSeatPrice> savedPrices = showtimeSeatPriceRepository.findByShowtimeId(showtime.getId());
        Map<SeatType, BigDecimal> map = new HashMap<>();

        if (!savedPrices.isEmpty()) {
            savedPrices.forEach(p -> map.put(p.getSeatType(), p.getPrice()));
        } else {
            BigDecimal base = showtime.getBasePrice();
            map.put(SeatType.NORMAL, base);
            map.put(SeatType.VIP, base.add(BigDecimal.valueOf(20000)));
            map.put(SeatType.COUPLE, base.multiply(BigDecimal.valueOf(2)));
        }
        return map;
    }

    private ShowtimeResponse buildShowtimeResponse(Showtime showtime) {
        String movieTitle = "Unknown Movie";
        String moviePoster = null;
        Optional<Movie> movieOpt = movieRepository.findById(showtime.getMovieId());
        if (movieOpt.isPresent()) {
            movieTitle = movieOpt.get().getTitle();
            moviePoster = movieOpt.get().getPosterUrl();
        }

        String roomName = "Unknown Room";
        Long cinemaId = null;
        String cinemaName = "Unknown Cinema";
        Optional<Room> roomOpt = roomRepository.findById(showtime.getRoomId());
        if (roomOpt.isPresent()) {
            Room room = roomOpt.get();
            roomName = room.getName();
            cinemaId = room.getCinemaId();
            Optional<Cinema> cinemaOpt = cinemaRepository.findById(cinemaId);
            if (cinemaOpt.isPresent()) {
                cinemaName = cinemaOpt.get().getName();
            }
        }

        List<ShowtimeSeatPriceDto> prices = showtimeSeatPriceRepository.findByShowtimeId(showtime.getId()).stream()
                .map(ShowtimeSeatPriceDto::fromDomain)
                .toList();

        return ShowtimeResponse.of(showtime, movieTitle, moviePoster, roomName, cinemaId, cinemaName, prices);
    }
}