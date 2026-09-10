package com.example.cinemabookingservice.booking.application.service;

import com.example.cinemabookingservice.booking.application.dto.BookingResponse;
import com.example.cinemabookingservice.booking.application.dto.BookingSeatDto;
import com.example.cinemabookingservice.booking.application.dto.HoldSeatsRequest;
import com.example.cinemabookingservice.booking.application.dto.TicketResponse;
import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingSeat;
import com.example.cinemabookingservice.booking.domain.BookingStatus;
import com.example.cinemabookingservice.booking.domain.Ticket;
import com.example.cinemabookingservice.booking.domain.TicketStatus;
import com.example.cinemabookingservice.booking.domain.exception.BookingNotFoundException;
import com.example.cinemabookingservice.booking.domain.exception.SeatAlreadyBookedException;
import com.example.cinemabookingservice.booking.domain.repository.BookingRepository;
import com.example.cinemabookingservice.booking.domain.repository.BookingSeatRepository;
import com.example.cinemabookingservice.booking.domain.repository.TicketRepository;
import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.cinema.domain.repository.CinemaRepository;
import com.example.cinemabookingservice.cinema.domain.repository.RoomRepository;
import com.example.cinemabookingservice.cinema.domain.repository.SeatRepository;
import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.domain.repository.MovieRepository;
import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;
import com.example.cinemabookingservice.showtime.domain.exception.ShowtimeNotFoundException;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeRepository;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeSeatPriceRepository;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.exception.UserNotFoundException;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatPriceRepository showtimeSeatPriceRepository;
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse holdSeats(String userEmail, HoldSeatsRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng: " + userEmail));

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ShowtimeNotFoundException("Không tìm thấy suất chiếu: " + request.getShowtimeId()));

        if (showtime.isFinished()) {
            throw new IllegalArgumentException("Suất chiếu này đã kết thúc hoặc không còn nhận đặt chỗ");
        }

        List<Long> seatIds = request.getSeatIds();

        // Kiểm tra xem có bất kỳ ghế nào đã bị đặt hoặc đang được giữ hay chưa
        if (bookingSeatRepository.isAnySeatBooked(showtime.getId(), seatIds)) {
            throw new SeatAlreadyBookedException("Một hoặc nhiều ghế bạn chọn vừa được người khác giữ chỗ. Vui lòng chọn ghế khác!");
        }

        // Lấy thông tin các ghế và kiểm tra có thuộc phòng chiếu này không
        List<Seat> seats = new ArrayList<>();
        for (Long seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ghế ID: " + seatId));
            if (!seat.getRoomId().equals(showtime.getRoomId())) {
                throw new IllegalArgumentException("Ghế " + seat.getSeatCode() + " không thuộc phòng chiếu này");
            }
            seats.add(seat);
        }

        // Lấy bảng giá theo loại ghế
        Map<SeatType, BigDecimal> priceMap = getSeatPriceMap(showtime);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<BookingSeat> bookingSeatsToSave = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Tạo mã đơn ngẫu nhiên: CG + 6 số ngẫu nhiên
        String bookingCode = "CG" + (100000 + new Random().nextInt(900000));

        // Thiết lập thời gian giữ chỗ 5 phút
        LocalDateTime expiresAt = now.plusMinutes(5);

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .userId(user.getId())
                .showtimeId(showtime.getId())
                .status(BookingStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .expiresAt(expiresAt)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        for (Seat seat : seats) {
            BigDecimal seatPrice = priceMap.getOrDefault(seat.getSeatType(), showtime.getBasePrice());
            totalAmount = totalAmount.add(seatPrice);

            BookingSeat bookingSeat = BookingSeat.builder()
                    .bookingId(savedBooking.getId())
                    .showtimeId(showtime.getId())
                    .seatId(seat.getId())
                    .price(seatPrice)
                    .createdAt(now)
                    .build();
            bookingSeatsToSave.add(bookingSeat);
        }

        // Cập nhật lại tổng tiền đơn hàng
        savedBooking.setTotalAmount(totalAmount);
        bookingRepository.save(savedBooking);

        try {
            bookingSeatRepository.saveAll(bookingSeatsToSave);
        } catch (DataIntegrityViolationException e) {
            // Trường hợp 2 người cùng bấm nút Giữ ghế cùng 1 mili-giây
            throw new SeatAlreadyBookedException("Ghế bạn chọn vừa có người khác nhanh tay giữ chỗ trước một tích tắc. Vui lòng chọn ghế khác!");
        }

        return buildBookingResponse(savedBooking);
    }

    @Transactional
    public void cancelBooking(String userEmail, Long bookingId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn đặt chỗ ID: " + bookingId));

        if (!booking.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền hủy đơn đặt chỗ này");
        }

        if (booking.canBeCancelled()) {
            // Giải phóng các ghế đã giữ
            bookingSeatRepository.deleteByBookingId(booking.getId());

            booking.setStatus(BookingStatus.CANCELLED);
            booking.setCancelledAt(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);
        } else {
            throw new IllegalStateException("Không thể hủy đơn đặt chỗ này (Trạng thái hiện tại: " + booking.getStatus() + ")");
        }
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        return bookings.stream().map(this::buildBookingResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn đặt chỗ với ID: " + id));

        if (!booking.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xem đơn hàng này");
        }

        return buildBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByCode(String bookingCode, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn đặt chỗ với mã: " + bookingCode));

        if (!booking.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xem đơn hàng này");
        }

        return buildBookingResponse(booking);
    }

    @Transactional
    public BookingResponse confirmBookingAndIssueTickets(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn đặt vé"));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return buildBookingResponse(booking);
        }

        LocalDateTime now = LocalDateTime.now();
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(now);
        booking.setUpdatedAt(now);
        Booking savedBooking = bookingRepository.save(booking);

        // Sinh vé điện tử độc lập cho từng ghế
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(savedBooking.getId());
        List<Ticket> ticketsToSave = new ArrayList<>();

        for (BookingSeat bs : bookingSeats) {
            // Mã vé: TK + 8 ký tự ngẫu nhiên
            String ticketCode = "TK" + (10000000 + new Random().nextInt(90000000));
            String qrData = "CINEGLOW:" + savedBooking.getBookingCode() + ":" + ticketCode + ":" + bs.getSeatId();

            Ticket ticket = Ticket.builder()
                    .ticketCode(ticketCode)
                    .bookingSeatId(bs.getId())
                    .qrCode(qrData)
                    .status(TicketStatus.UNUSED)
                    .createdAt(now)
                    .build();
            ticketsToSave.add(ticket);
        }

        ticketRepository.saveAll(ticketsToSave);

        return buildBookingResponse(savedBooking);
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

    private BookingResponse buildBookingResponse(Booking booking) {
        Optional<Showtime> showtimeOpt = showtimeRepository.findById(booking.getShowtimeId());
        String movieTitle = "Unknown Movie";
        String moviePosterUrl = null;
        String roomName = "Unknown Room";
        String cinemaName = "Unknown Cinema";
        LocalDateTime startTime = null;
        LocalDateTime endTime = null;

        if (showtimeOpt.isPresent()) {
            Showtime st = showtimeOpt.get();
            startTime = st.getStartTime();
            endTime = st.getEndTime();

            Optional<Movie> movieOpt = movieRepository.findById(st.getMovieId());
            if (movieOpt.isPresent()) {
                movieTitle = movieOpt.get().getTitle();
                moviePosterUrl = movieOpt.get().getPosterUrl();
            }

            Optional<Room> roomOpt = roomRepository.findById(st.getRoomId());
            if (roomOpt.isPresent()) {
                roomName = roomOpt.get().getName();
                Optional<Cinema> cinemaOpt = cinemaRepository.findById(roomOpt.get().getCinemaId());
                if (cinemaOpt.isPresent()) {
                    cinemaName = cinemaOpt.get().getName();
                }
            }
        }

        // Danh sách ghế của đơn đặt
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(booking.getId());
        List<BookingSeatDto> seatDtos = new ArrayList<>();
        List<Long> bookingSeatIds = new ArrayList<>();

        for (BookingSeat bs : bookingSeats) {
            bookingSeatIds.add(bs.getId());
            Optional<Seat> seatOpt = seatRepository.findById(bs.getSeatId());

            BookingSeatDto.BookingSeatDtoBuilder builder = BookingSeatDto.builder()
                    .bookingSeatId(bs.getId())
                    .seatId(bs.getSeatId())
                    .price(bs.getPrice());

            if (seatOpt.isPresent()) {
                Seat s = seatOpt.get();
                builder.rowLabel(s.getRowLabel())
                        .seatNumber(s.getSeatNumber())
                        .seatCode(s.getSeatCode())
                        .seatType(s.getSeatType());
            }
            seatDtos.add(builder.build());
        }

        // Danh sách vé điện tử (nếu có)
        List<TicketResponse> ticketResponses = new ArrayList<>();
        if (!bookingSeatIds.isEmpty()) {
            List<Ticket> tickets = ticketRepository.findByBookingSeatIds(bookingSeatIds);
            for (Ticket t : tickets) {
                // Ghép seatCode cho vé
                String seatCode = "";
                SeatType seatType = SeatType.NORMAL;
                Long seatId = null;

                for (BookingSeatDto dto : seatDtos) {
                    if (dto.getBookingSeatId().equals(t.getBookingSeatId())) {
                        seatCode = dto.getSeatCode();
                        seatType = dto.getSeatType();
                        seatId = dto.getSeatId();
                        break;
                    }
                }

                ticketResponses.add(TicketResponse.builder()
                        .id(t.getId())
                        .ticketCode(t.getTicketCode())
                        .bookingSeatId(t.getBookingSeatId())
                        .seatId(seatId)
                        .seatCode(seatCode)
                        .seatType(seatType)
                        .qrCode(t.getQrCode())
                        .status(t.getStatus())
                        .checkedInAt(t.getCheckedInAt())
                        .createdAt(t.getCreatedAt())
                        .build());
            }
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .userId(booking.getUserId())
                .showtimeId(booking.getShowtimeId())
                .movieTitle(movieTitle)
                .moviePosterUrl(moviePosterUrl)
                .roomName(roomName)
                .cinemaName(cinemaName)
                .startTime(startTime)
                .endTime(endTime)
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .expiresAt(booking.getExpiresAt())
                .createdAt(booking.getCreatedAt())
                .confirmedAt(booking.getConfirmedAt())
                .seats(seatDtos)
                .tickets(ticketResponses)
                .build();
    }
}