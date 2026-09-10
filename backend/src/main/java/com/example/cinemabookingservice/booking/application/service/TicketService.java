package com.example.cinemabookingservice.booking.application.service;

import com.example.cinemabookingservice.booking.application.dto.TicketCheckInRequest;
import com.example.cinemabookingservice.booking.application.dto.TicketCheckInResponse;
import com.example.cinemabookingservice.booking.application.dto.TicketResponse;
import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingSeat;
import com.example.cinemabookingservice.booking.domain.Ticket;
import com.example.cinemabookingservice.booking.domain.TicketStatus;
import com.example.cinemabookingservice.booking.domain.exception.TicketAlreadyUsedException;
import com.example.cinemabookingservice.booking.domain.exception.TicketNotFoundException;
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
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeRepository;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.exception.UserNotFoundException;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng"));

        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        List<TicketResponse> result = new ArrayList<>();

        for (Booking b : bookings) {
            List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(b.getId());
            List<Long> seatIds = bookingSeats.stream().map(BookingSeat::getId).toList();
            if (!seatIds.isEmpty()) {
                List<Ticket> tickets = ticketRepository.findByBookingSeatIds(seatIds);
                for (Ticket t : tickets) {
                    result.add(buildTicketResponse(t));
                }
            }
        }
        return result;
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketByCode(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new TicketNotFoundException("KhÃ´ng tÃ¬m tháº¥y vÃ© vá»›i mÃ£: " + ticketCode));
        return buildTicketResponse(ticket);
    }

    @Transactional
    public TicketCheckInResponse checkInTicket(TicketCheckInRequest request) {
        String codeOrQr = request.getTicketCodeOrQr().trim();
        String ticketCode = extractTicketCode(codeOrQr);

        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new TicketNotFoundException("VÃ© khÃ´ng há»£p lá»‡ hoáº·c khÃ´ng tá»“n táº¡i trÃªn há»‡ thá»‘ng"));

        if (ticket.getStatus() == TicketStatus.USED) {
            throw new TicketAlreadyUsedException("VÃ© nÃ y Ä‘Ã£ Ä‘Æ°á»£c soÃ¡t lÃºc: " + ticket.getCheckedInAt() + ". KhÃ´ng thá»ƒ tÃ¡i sá»­ dá»¥ng!");
        }

        if (ticket.getStatus() == TicketStatus.CANCELLED) {
            throw new IllegalStateException("VÃ© nÃ y Ä‘Ã£ bá»‹ há»§y, khÃ´ng Ä‘Æ°á»£c phÃ©p vÃ o ráº¡p");
        }

        LocalDateTime now = LocalDateTime.now();
        ticket.setStatus(TicketStatus.USED);
        ticket.setCheckedInAt(now);
        ticketRepository.save(ticket);

        // Láº¥y thÃ´ng tin hiá»ƒn thá»‹ mÃ n hÃ¬nh soÃ¡t vÃ©
        String movieTitle = "Unknown";
        String roomName = "Unknown";
        String cinemaName = "Unknown";
        String seatCode = "Unknown";
        LocalDateTime startTime = null;

        Optional<BookingSeat> bsOpt = bookingSeatRepository.findById(ticket.getBookingSeatId());
        if (bsOpt.isPresent()) {
            BookingSeat bs = bsOpt.get();
            Optional<Seat> seatOpt = seatRepository.findById(bs.getSeatId());
            if (seatOpt.isPresent()) {
                seatCode = seatOpt.get().getSeatCode();
            }

            Optional<Showtime> stOpt = showtimeRepository.findById(bs.getShowtimeId());
            if (stOpt.isPresent()) {
                Showtime st = stOpt.get();
                startTime = st.getStartTime();

                Optional<Movie> movieOpt = movieRepository.findById(st.getMovieId());
                if (movieOpt.isPresent()) movieTitle = movieOpt.get().getTitle();

                Optional<Room> roomOpt = roomRepository.findById(st.getRoomId());
                if (roomOpt.isPresent()) {
                    roomName = roomOpt.get().getName();
                    Optional<Cinema> cinemaOpt = cinemaRepository.findById(roomOpt.get().getCinemaId());
                    if (cinemaOpt.isPresent()) cinemaName = cinemaOpt.get().getName();
                }
            }
        }

        return TicketCheckInResponse.builder()
                .success(true)
                .message("SoÃ¡t vÃ© thÃ nh cÃ´ng! ChÃºc quÃ½ khÃ¡ch xem phim vui váº».")
                .ticketCode(ticket.getTicketCode())
                .seatCode(seatCode)
                .movieTitle(movieTitle)
                .roomName(roomName)
                .cinemaName(cinemaName)
                .startTime(startTime)
                .checkedInAt(now)
                .build();
    }

    private String extractTicketCode(String codeOrQr) {
        // Há»— trá»£ Ä‘á»‹nh dáº¡ng QR: CINEGLOW:<bookingCode>:<ticketCode>:<seatId>
        if (codeOrQr.startsWith("CINEGLOW:")) {
            String[] parts = codeOrQr.split(":");
            if (parts.length >= 3) {
                return parts[2];
            }
        }
        return codeOrQr;
    }

    private TicketResponse buildTicketResponse(Ticket ticket) {
        String seatCode = "";
        SeatType seatType = SeatType.NORMAL;
        Long seatId = null;

        Optional<BookingSeat> bsOpt = bookingSeatRepository.findById(ticket.getBookingSeatId());
        if (bsOpt.isPresent()) {
            seatId = bsOpt.get().getSeatId();
            Optional<Seat> seatOpt = seatRepository.findById(seatId);
            if (seatOpt.isPresent()) {
                seatCode = seatOpt.get().getSeatCode();
                seatType = seatOpt.get().getSeatType();
            }
        }

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .bookingSeatId(ticket.getBookingSeatId())
                .seatId(seatId)
                .seatCode(seatCode)
                .seatType(seatType)
                .qrCode(ticket.getQrCode())
                .status(ticket.getStatus())
                .checkedInAt(ticket.getCheckedInAt())
                .createdAt(ticket.getCreatedAt())
                .build();
    }
}