package com.example.cinemabookingservice.shared.seeder;

import com.example.cinemabookingservice.cinema.domain.Cinema;
import com.example.cinemabookingservice.cinema.domain.Room;
import com.example.cinemabookingservice.cinema.domain.Seat;
import com.example.cinemabookingservice.cinema.domain.SeatType;
import com.example.cinemabookingservice.cinema.domain.repository.CinemaRepository;
import com.example.cinemabookingservice.cinema.domain.repository.RoomRepository;
import com.example.cinemabookingservice.cinema.domain.repository.SeatRepository;
import com.example.cinemabookingservice.movie.domain.Genre;
import com.example.cinemabookingservice.movie.domain.Movie;
import com.example.cinemabookingservice.movie.domain.MovieStatus;
import com.example.cinemabookingservice.movie.domain.repository.GenreRepository;
import com.example.cinemabookingservice.movie.domain.repository.MovieRepository;
import com.example.cinemabookingservice.notification.application.service.NotificationService;
import com.example.cinemabookingservice.showtime.domain.Showtime;
import com.example.cinemabookingservice.showtime.domain.ShowtimeSeatPrice;
import com.example.cinemabookingservice.showtime.domain.ShowtimeStatus;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeRepository;
import com.example.cinemabookingservice.showtime.domain.repository.ShowtimeSeatPriceRepository;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.UserRole;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GenreRepository genreRepository;
    private final MovieRepository movieRepository;
    private final CinemaRepository cinemaRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeSeatPriceRepository showtimeSeatPriceRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void run(String... args) {
        try {
            log.info("--- [CINEGLOW DATA SEEDER] Kiá»ƒm tra vÃ  khá»Ÿi táº¡o dá»¯ liá»‡u máº«u ---");
            seedUsers();
            Set<Genre> genres = seedGenres();
            List<Movie> movies = seedMovies(genres);
            List<Room> rooms = seedCinemasRoomsAndSeats();
            seedShowtimes(movies, rooms);
            log.info("--- [CINEGLOW DATA SEEDER] HoÃ n táº¥t khá»Ÿi táº¡o dá»¯ liá»‡u máº«u thÃ nh cÃ´ng! ---");
        } catch (Exception e) {
            log.warn("--- [CINEGLOW DATA SEEDER] Ghi nháº­n lÆ°u Ã½ trong quÃ¡ trÃ¬nh seed: {} ---", e.getMessage());
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@cinema.com")) {
            User admin = User.builder()
                    .fullName("Quáº£n Trá»‹ ViÃªn Há»‡ Thá»‘ng")
                    .email("admin@cinema.com")
                    .phone("0901234567")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(UserRole.ADMIN)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info(">> ÄÃ£ táº¡o tÃ i khoáº£n ADMIN: admin@cinema.com / 123456");
        }

        if (!userRepository.existsByEmail("staff@cinema.com")) {
            User staff = User.builder()
                    .fullName("NhÃ¢n ViÃªn SoÃ¡t VÃ©")
                    .email("staff@cinema.com")
                    .phone("0901234568")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(UserRole.STAFF)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(staff);
            log.info(">> ÄÃ£ táº¡o tÃ i khoáº£n STAFF: staff@cinema.com / 123456");
        }

        if (!userRepository.existsByEmail("user@cinema.com")) {
            User customer = User.builder()
                    .fullName("Nguyá»…n VÄƒn A")
                    .email("user@cinema.com")
                    .phone("0901234569")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(UserRole.USER)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            User savedCustomer = userRepository.save(customer);
            log.info(">> ÄÃ£ táº¡o tÃ i khoáº£n USER: user@cinema.com / 123456");

            // Táº¡o thÃ´ng bÃ¡o chÃ o má»«ng
            notificationService.createNotification(
                    savedCustomer.getId(),
                    "ChÃ o má»«ng Ä‘áº¿n vá»›i ráº¡p chiáº¿u phim CineGlow!",
                    "ChÃºc báº¡n cÃ³ nhá»¯ng tráº£i nghiá»‡m xem phim Ä‘iá»‡n áº£nh tuyá»‡t vá»i nháº¥t táº¡i há»‡ thá»‘ng ráº¡p CineGlow."
            );
        }
    }

    private Set<Genre> seedGenres() {
        Set<Genre> result = new HashSet<>();
        String[] genreNames = {"HÃ nh Äá»™ng", "Khoa Há»c Viá»…n TÆ°á»Ÿng", "Kinh Dá»‹", "Hoáº¡t HÃ¬nh", "TÃ¬nh Cáº£m", "HÃ i HÆ°á»›c", "PhiÃªu LÆ°u"};
        LocalDateTime now = LocalDateTime.now();

        for (String name : genreNames) {
            if (!genreRepository.existsByName(name)) {
                Genre g = new Genre(null, name, "Thá»ƒ loáº¡i " + name, now, now);
                result.add(genreRepository.save(g));
            }
        }
        return result;
    }

    private List<Movie> seedMovies(Set<Genre> genres) {
        List<Movie> movies = new ArrayList<>();
        if (movieRepository.findAll(0, 1).totalElements() > 0) {
            return movieRepository.findAll(0, 10).content();
        }

        LocalDateTime now = LocalDateTime.now();

        Movie m1 = new Movie(
                null,
                "Dune: HÃ nh Tinh CÃ¡t - Pháº§n 2",
                "Dune: Part Two",
                "Paul Atreides há»£p nháº¥t vá»›i Chani vÃ  ngÆ°á»i Fremen Ä‘á»ƒ tráº£ thÃ¹ nhá»¯ng káº» Ã¢m mÆ°u tiÃªu diá»‡t gia Ä‘Ã¬nh anh.",
                166,
                LocalDate.now().minusDays(10),
                LocalDate.now().plusDays(30),
                "T16",
                "Denis Villeneuve",
                "Tiáº¿ng Anh (Phá»¥ Ä‘á» Tiáº¿ng Viá»‡t)",
                "Má»¹",
                "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx2zx.jpg",
                "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
                "https://www.youtube.com/watch?v=Way9Dexny3w",
                MovieStatus.NOW_SHOWING,
                genres,
                now,
                now
        );
        movies.add(movieRepository.save(m1));

        Movie m2 = new Movie(
                null,
                "Godzilla x Kong: Äáº¿ Cháº¿ Má»›i",
                "Godzilla x Kong: The New Empire",
                "Hai gÃ£ khá»•ng lá»“ Ä‘á»‘i Ä‘áº§u vá»›i má»‘i Ä‘e dá»a to lá»›n chÆ°a tá»«ng tháº¥y áº©n sÃ¢u trong TrÃ¡i Äáº¥t.",
                115,
                LocalDate.now().minusDays(5),
                LocalDate.now().plusDays(25),
                "T13",
                "Adam Wingard",
                "Tiáº¿ng Anh (Phá»¥ Ä‘á» Tiáº¿ng Viá»‡t)",
                "Má»¹",
                "https://image.tmdb.org/t/p/w500/bQ2ywkch09oT9GWT4YjhFptOezq.jpg",
                "https://image.tmdb.org/t/p/original/qrGtVF3YZvJ6c1XgG9Vp8qH8x.jpg",
                "https://www.youtube.com/watch?v=lV1OOlGwExg",
                MovieStatus.NOW_SHOWING,
                genres,
                now,
                now
        );
        movies.add(movieRepository.save(m2));

        Movie m3 = new Movie(
                null,
                "Mai",
                "Mai",
                "CÃ¢u chuyá»‡n tÃ¬nh cáº£m Ä‘áº§y tráº¯c trá»Ÿ giá»¯a Mai vÃ  DÆ°Æ¡ng táº¡i má»™t chung cÆ° cÅ© cá»§a SÃ i GÃ²n.",
                131,
                LocalDate.now().minusDays(20),
                LocalDate.now().plusDays(15),
                "T18",
                "Tráº¥n ThÃ nh",
                "Tiáº¿ng Viá»‡t",
                "Viá»‡t Nam",
                "https://image.tmdb.org/t/p/w500/yPt3b8eP6e0iYv5e4eY8uM8t4.jpg",
                "https://image.tmdb.org/t/p/original/mai_backdrop.jpg",
                "https://www.youtube.com/watch?v=mai_trailer",
                MovieStatus.NOW_SHOWING,
                genres,
                now,
                now
        );
        movies.add(movieRepository.save(m3));

        Movie m4 = new Movie(
                null,
                "Kung Fu Panda 4",
                "Kung Fu Panda 4",
                "Po pháº£i tÃ¬m kiáº¿m vÃ  huáº¥n luyá»‡n má»™t Tháº§n Long Äáº¡i Hiá»‡p má»›i trÆ°á»›c khi nháº­n chá»©c vá»¥ thá»§ lÄ©nh tÃ¢m linh.",
                94,
                LocalDate.now().minusDays(2),
                LocalDate.now().plusDays(35),
                "P",
                "Mike Mitchell",
                "Lá»“ng tiáº¿ng Tiáº¿ng Viá»‡t",
                "Má»¹",
                "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
                "https://image.tmdb.org/t/p/original/panda_backdrop.jpg",
                "https://www.youtube.com/watch?v=_inKs4eeHiI",
                MovieStatus.NOW_SHOWING,
                genres,
                now,
                now
        );
        movies.add(movieRepository.save(m4));

        log.info(">> ÄÃ£ náº¡p 4 phim bom táº¥n máº«u thÃ nh cÃ´ng");
        return movies;
    }

    private List<Room> seedCinemasRoomsAndSeats() {
        List<Cinema> existing = cinemaRepository.findAll();
        List<Room> allRooms = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        if (existing.isEmpty()) {
            Cinema c1 = Cinema.builder()
                    .name("CineGlow Landmark 81")
                    .address("Táº§ng B1, TTTM Vincom Landmark 81, 720A Äiá»‡n BiÃªn Phá»§, P.22, BÃ¬nh Tháº¡nh")
                    .city("Há»“ ChÃ­ Minh")
                    .isActive(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            Cinema savedC1 = cinemaRepository.save(c1);

            Cinema c2 = Cinema.builder()
                    .name("CineGlow Royal City")
                    .address("Táº§ng B2, TTTM Vincom Mega Mall Royal City, 72A Nguyá»…n TrÃ£i, Thanh XuÃ¢n")
                    .city("HÃ  Ná»™i")
                    .isActive(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            Cinema savedC2 = cinemaRepository.save(c2);

            existing.add(savedC1);
            existing.add(savedC2);
            log.info(">> ÄÃ£ táº¡o cÃ¡c cá»¥m ráº¡p: CineGlow Landmark 81 & CineGlow Royal City");
        }

        for (Cinema cinema : existing) {
            List<Room> rooms = roomRepository.findByCinemaId(cinema.getId());
            if (rooms.isEmpty()) {
                Room r1 = Room.builder()
                        .cinemaId(cinema.getId())
                        .name("PhÃ²ng 01 - IMAX Laser")
                        .totalRows(6)
                        .totalColumns(10)
                        .isActive(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                Room savedR1 = roomRepository.save(r1);
                generateSeatsForRoom(savedR1);
                allRooms.add(savedR1);

                Room r2 = Room.builder()
                        .cinemaId(cinema.getId())
                        .name("PhÃ²ng 02 - Standard Cinema")
                        .totalRows(5)
                        .totalColumns(8)
                        .isActive(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                Room savedR2 = roomRepository.save(r2);
                generateSeatsForRoom(savedR2);
                allRooms.add(savedR2);
            } else {
                allRooms.addAll(rooms);
            }
        }
        return allRooms;
    }

    private void generateSeatsForRoom(Room room) {
        List<Seat> seats = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        int rows = room.getTotalRows() != null ? room.getTotalRows() : 6;
        int cols = room.getTotalColumns() != null ? room.getTotalColumns() : 8;

        for (int r = 0; r < rows; r++) {
            char rowChar = (char) ('A' + r);
            SeatType type;
            if (r < 2) {
                type = SeatType.NORMAL;
            } else if (r < rows - 1) {
                type = SeatType.VIP;
            } else {
                type = SeatType.COUPLE;
            }

            for (int c = 1; c <= cols; c++) {
                seats.add(Seat.builder()
                        .roomId(room.getId())
                        .rowLabel(String.valueOf(rowChar))
                        .seatNumber(c)
                        .seatType(type)
                        .isActive(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build());
            }
        }
        seatRepository.saveAll(seats);
        log.info(">> ÄÃ£ sinh {} gháº¿ cho phÃ²ng {}", seats.size(), room.getName());
    }

    private void seedShowtimes(List<Movie> movies, List<Room> rooms) {
        if (showtimeRepository.findAll().isEmpty() && !movies.isEmpty() && !rooms.isEmpty()) {
            LocalDateTime today = LocalDateTime.now().withHour(10).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime now = LocalDateTime.now();

            int[] startHours = {10, 14, 18, 21};
            for (int i = 0; i < Math.min(movies.size(), rooms.size()); i++) {
                Movie movie = movies.get(i);
                Room room = rooms.get(i);

                for (int hour : startHours) {
                    LocalDateTime stTime = today.withHour(hour);
                    LocalDateTime endTime = stTime.plusMinutes(movie.getDurationMinutes() + 15);

                    Showtime st = Showtime.builder()
                            .movieId(movie.getId())
                            .roomId(room.getId())
                            .startTime(stTime)
                            .endTime(endTime)
                            .basePrice(new BigDecimal("75000"))
                            .status(ShowtimeStatus.ACTIVE)
                            .createdAt(now)
                            .updatedAt(now)
                            .build();
                    Showtime savedSt = showtimeRepository.save(st);

                    // GiÃ¡ Ä‘á»™ng cho tá»«ng loáº¡i gháº¿
                    List<ShowtimeSeatPrice> prices = List.of(
                            ShowtimeSeatPrice.builder().showtimeId(savedSt.getId()).seatType(SeatType.NORMAL).price(new BigDecimal("75000")).build(),
                            ShowtimeSeatPrice.builder().showtimeId(savedSt.getId()).seatType(SeatType.VIP).price(new BigDecimal("95000")).build(),
                            ShowtimeSeatPrice.builder().showtimeId(savedSt.getId()).seatType(SeatType.COUPLE).price(new BigDecimal("180000")).build()
                    );
                    showtimeSeatPriceRepository.saveAll(prices);
                }
            }
            log.info(">> ÄÃ£ sinh cÃ¡c suáº¥t chiáº¿u vÃ  cáº¥u hÃ¬nh giÃ¡ gháº¿ Ä‘á»™ng máº«u cho ngÃ y hÃ´m nay");
        }
    }
}