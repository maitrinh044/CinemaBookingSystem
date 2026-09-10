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
            log.info("--- [CINEGLOW DATA SEEDER] KiÃƒÂ¡Ã‚Â»Ã†â€™m tra vÃƒÆ’Ã‚Â  khÃƒÂ¡Ã‚Â»Ã…Â¸i tÃƒÂ¡Ã‚ÂºÃ‚Â¡o dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u mÃƒÂ¡Ã‚ÂºÃ‚Â«u ---");
            seedUsers();
            Set<Genre> genres = seedGenres();
            List<Movie> movies = seedMovies(genres);
            List<Room> rooms = seedCinemasRoomsAndSeats();
            seedShowtimes(movies, rooms);
            log.info("--- [CINEGLOW DATA SEEDER] HoÃƒÆ’Ã‚Â n tÃƒÂ¡Ã‚ÂºÃ‚Â¥t khÃƒÂ¡Ã‚Â»Ã…Â¸i tÃƒÂ¡Ã‚ÂºÃ‚Â¡o dÃƒÂ¡Ã‚Â»Ã‚Â¯ liÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡u mÃƒÂ¡Ã‚ÂºÃ‚Â«u thÃƒÆ’Ã‚Â nh cÃƒÆ’Ã‚Â´ng! ---");
        } catch (Exception e) {
            log.warn("--- [CINEGLOW DATA SEEDER] Ghi nhÃƒÂ¡Ã‚ÂºÃ‚Â­n lÃƒâ€ Ã‚Â°u ÃƒÆ’Ã‚Â½ trong quÃƒÆ’Ã‚Â¡ trÃƒÆ’Ã‚Â¬nh seed: {} ---", e.getMessage());
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@cinema.com")) {
            User admin = User.builder()
                    .fullName("QuÃƒÂ¡Ã‚ÂºÃ‚Â£n TrÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹ ViÃƒÆ’Ã‚Âªn HÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡ ThÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœng")
                    .email("admin@cinema.com")
                    .phone("0901234567")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(UserRole.ADMIN)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o tÃƒÆ’Ã‚Â i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n ADMIN: admin@cinema.com / 123456");
        }

        if (!userRepository.existsByEmail("staff@cinema.com")) {
            User staff = User.builder()
                    .fullName("NhÃƒÆ’Ã‚Â¢n ViÃƒÆ’Ã‚Âªn SoÃƒÆ’Ã‚Â¡t VÃƒÆ’Ã‚Â©")
                    .email("staff@cinema.com")
                    .phone("0901234568")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(UserRole.STAFF)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(staff);
            log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o tÃƒÆ’Ã‚Â i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n STAFF: staff@cinema.com / 123456");
        }

        if (!userRepository.existsByEmail("user@cinema.com")) {
            User customer = User.builder()
                    .fullName("NguyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¦n VÃƒâ€žÃ†â€™n A")
                    .email("user@cinema.com")
                    .phone("0901234569")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(UserRole.USER)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            User savedCustomer = userRepository.save(customer);
            log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o tÃƒÆ’Ã‚Â i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n USER: user@cinema.com / 123456");

            // TÃƒÂ¡Ã‚ÂºÃ‚Â¡o thÃƒÆ’Ã‚Â´ng bÃƒÆ’Ã‚Â¡o chÃƒÆ’Ã‚Â o mÃƒÂ¡Ã‚Â»Ã‚Â«ng
            notificationService.createNotification(
                    savedCustomer.getId(),
                    "ChÃƒÆ’Ã‚Â o mÃƒÂ¡Ã‚Â»Ã‚Â«ng Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â¿n vÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi rÃƒÂ¡Ã‚ÂºÃ‚Â¡p chiÃƒÂ¡Ã‚ÂºÃ‚Â¿u phim CineGlow!",
                    "ChÃƒÆ’Ã‚Âºc bÃƒÂ¡Ã‚ÂºÃ‚Â¡n cÃƒÆ’Ã‚Â³ nhÃƒÂ¡Ã‚Â»Ã‚Â¯ng trÃƒÂ¡Ã‚ÂºÃ‚Â£i nghiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡m xem phim Ãƒâ€žÃ¢â‚¬ËœiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n ÃƒÂ¡Ã‚ÂºÃ‚Â£nh tuyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t vÃƒÂ¡Ã‚Â»Ã‚Âi nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t tÃƒÂ¡Ã‚ÂºÃ‚Â¡i hÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡ thÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœng rÃƒÂ¡Ã‚ÂºÃ‚Â¡p CineGlow."
            );
        }
    }

    private Set<Genre> seedGenres() {
        Set<Genre> result = new HashSet<>();
        String[] genreNames = {"HÃƒÆ’Ã‚Â nh Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng", "Khoa HÃƒÂ¡Ã‚Â»Ã‚Âc ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¦n TÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã…Â¸ng", "Kinh DÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹", "HoÃƒÂ¡Ã‚ÂºÃ‚Â¡t HÃƒÆ’Ã‚Â¬nh", "TÃƒÆ’Ã‚Â¬nh CÃƒÂ¡Ã‚ÂºÃ‚Â£m", "HÃƒÆ’Ã‚Â i HÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc", "PhiÃƒÆ’Ã‚Âªu LÃƒâ€ Ã‚Â°u"};
        LocalDateTime now = LocalDateTime.now();

        for (String name : genreNames) {
            if (!genreRepository.existsByName(name)) {
                Genre g = new Genre(null, name, "ThÃƒÂ¡Ã‚Â»Ã†â€™ loÃƒÂ¡Ã‚ÂºÃ‚Â¡i " + name, now, now);
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
                "Dune: HÃƒÆ’Ã‚Â nh Tinh CÃƒÆ’Ã‚Â¡t - PhÃƒÂ¡Ã‚ÂºÃ‚Â§n 2",
                "Dune: Part Two",
                "Paul Atreides hÃƒÂ¡Ã‚Â»Ã‚Â£p nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t vÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi Chani vÃƒÆ’Ã‚Â  ngÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âi Fremen Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ trÃƒÂ¡Ã‚ÂºÃ‚Â£ thÃƒÆ’Ã‚Â¹ nhÃƒÂ¡Ã‚Â»Ã‚Â¯ng kÃƒÂ¡Ã‚ÂºÃ‚Â» ÃƒÆ’Ã‚Â¢m mÃƒâ€ Ã‚Â°u tiÃƒÆ’Ã‚Âªu diÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t gia Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¬nh anh.",
                166,
                LocalDate.now().minusDays(10),
                LocalDate.now().plusDays(30),
                "T16",
                "Denis Villeneuve",
                "TiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng Anh (PhÃƒÂ¡Ã‚Â»Ã‚Â¥ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â TiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t)",
                "MÃƒÂ¡Ã‚Â»Ã‚Â¹",
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
                "Godzilla x Kong: Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚ÂºÃ‚Â¿ ChÃƒÂ¡Ã‚ÂºÃ‚Â¿ MÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi",
                "Godzilla x Kong: The New Empire",
                "Hai gÃƒÆ’Ã‚Â£ khÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ng lÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§u vÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi mÃƒÂ¡Ã‚Â»Ã¢â‚¬Ëœi Ãƒâ€žÃ¢â‚¬Ëœe dÃƒÂ¡Ã‚Â»Ã‚Âa to lÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºn chÃƒâ€ Ã‚Â°a tÃƒÂ¡Ã‚Â»Ã‚Â«ng thÃƒÂ¡Ã‚ÂºÃ‚Â¥y ÃƒÂ¡Ã‚ÂºÃ‚Â©n sÃƒÆ’Ã‚Â¢u trong TrÃƒÆ’Ã‚Â¡i Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚ÂºÃ‚Â¥t.",
                115,
                LocalDate.now().minusDays(5),
                LocalDate.now().plusDays(25),
                "T13",
                "Adam Wingard",
                "TiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng Anh (PhÃƒÂ¡Ã‚Â»Ã‚Â¥ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã‚Â TiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t)",
                "MÃƒÂ¡Ã‚Â»Ã‚Â¹",
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
                "CÃƒÆ’Ã‚Â¢u chuyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n tÃƒÆ’Ã‚Â¬nh cÃƒÂ¡Ã‚ÂºÃ‚Â£m Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚ÂºÃ‚Â§y trÃƒÂ¡Ã‚ÂºÃ‚Â¯c trÃƒÂ¡Ã‚Â»Ã…Â¸ giÃƒÂ¡Ã‚Â»Ã‚Â¯a Mai vÃƒÆ’Ã‚Â  DÃƒâ€ Ã‚Â°Ãƒâ€ Ã‚Â¡ng tÃƒÂ¡Ã‚ÂºÃ‚Â¡i mÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t chung cÃƒâ€ Ã‚Â° cÃƒâ€¦Ã‚Â© cÃƒÂ¡Ã‚Â»Ã‚Â§a SÃƒÆ’Ã‚Â i GÃƒÆ’Ã‚Â²n.",
                131,
                LocalDate.now().minusDays(20),
                LocalDate.now().plusDays(15),
                "T18",
                "TrÃƒÂ¡Ã‚ÂºÃ‚Â¥n ThÃƒÆ’Ã‚Â nh",
                "TiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t",
                "ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t Nam",
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
                "Po phÃƒÂ¡Ã‚ÂºÃ‚Â£i tÃƒÆ’Ã‚Â¬m kiÃƒÂ¡Ã‚ÂºÃ‚Â¿m vÃƒÆ’Ã‚Â  huÃƒÂ¡Ã‚ÂºÃ‚Â¥n luyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n mÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢t ThÃƒÂ¡Ã‚ÂºÃ‚Â§n Long Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚ÂºÃ‚Â¡i HiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡p mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi trÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc khi nhÃƒÂ¡Ã‚ÂºÃ‚Â­n chÃƒÂ¡Ã‚Â»Ã‚Â©c vÃƒÂ¡Ã‚Â»Ã‚Â¥ thÃƒÂ¡Ã‚Â»Ã‚Â§ lÃƒâ€žÃ‚Â©nh tÃƒÆ’Ã‚Â¢m linh.",
                94,
                LocalDate.now().minusDays(2),
                LocalDate.now().plusDays(35),
                "P",
                "Mike Mitchell",
                "LÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ng tiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng TiÃƒÂ¡Ã‚ÂºÃ‚Â¿ng ViÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡t",
                "MÃƒÂ¡Ã‚Â»Ã‚Â¹",
                "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
                "https://image.tmdb.org/t/p/original/panda_backdrop.jpg",
                "https://www.youtube.com/watch?v=_inKs4eeHiI",
                MovieStatus.NOW_SHOWING,
                genres,
                now,
                now
        );
        movies.add(movieRepository.save(m4));

        log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ nÃƒÂ¡Ã‚ÂºÃ‚Â¡p 4 phim bom tÃƒÂ¡Ã‚ÂºÃ‚Â¥n mÃƒÂ¡Ã‚ÂºÃ‚Â«u thÃƒÆ’Ã‚Â nh cÃƒÆ’Ã‚Â´ng");
        return movies;
    }

    private List<Room> seedCinemasRoomsAndSeats() {
        List<Cinema> existing = new ArrayList<>(cinemaRepository.findAll());
        List<Room> allRooms = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        if (existing.isEmpty()) {
            Cinema c1 = Cinema.builder()
                    .name("CineGlow Landmark 81")
                    .address("TÃƒÂ¡Ã‚ÂºÃ‚Â§ng B1, TTTM Vincom Landmark 81, 720A Ãƒâ€žÃ‚ÂiÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡n BiÃƒÆ’Ã‚Âªn PhÃƒÂ¡Ã‚Â»Ã‚Â§, P.22, BÃƒÆ’Ã‚Â¬nh ThÃƒÂ¡Ã‚ÂºÃ‚Â¡nh")
                    .city("HÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ ChÃƒÆ’Ã‚Â­ Minh")
                    .isActive(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            Cinema savedC1 = cinemaRepository.save(c1);

            Cinema c2 = Cinema.builder()
                    .name("CineGlow Royal City")
                    .address("TÃƒÂ¡Ã‚ÂºÃ‚Â§ng B2, TTTM Vincom Mega Mall Royal City, 72A NguyÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¦n TrÃƒÆ’Ã‚Â£i, Thanh XuÃƒÆ’Ã‚Â¢n")
                    .city("HÃƒÆ’Ã‚Â  NÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢i")
                    .isActive(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            Cinema savedC2 = cinemaRepository.save(c2);

            existing.add(savedC1);
            existing.add(savedC2);
            log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ tÃƒÂ¡Ã‚ÂºÃ‚Â¡o cÃƒÆ’Ã‚Â¡c cÃƒÂ¡Ã‚Â»Ã‚Â¥m rÃƒÂ¡Ã‚ÂºÃ‚Â¡p: CineGlow Landmark 81 & CineGlow Royal City");
        }

        for (Cinema cinema : existing) {
            List<Room> rooms = roomRepository.findByCinemaId(cinema.getId());
            if (rooms.isEmpty()) {
                Room r1 = Room.builder()
                        .cinemaId(cinema.getId())
                        .name("PhÃƒÆ’Ã‚Â²ng 01 - IMAX Laser")
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
                        .name("PhÃƒÆ’Ã‚Â²ng 02 - Standard Cinema")
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
        log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ sinh {} ghÃƒÂ¡Ã‚ÂºÃ‚Â¿ cho phÃƒÆ’Ã‚Â²ng {}", seats.size(), room.getName());
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

                    // GiÃƒÆ’Ã‚Â¡ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng cho tÃƒÂ¡Ã‚Â»Ã‚Â«ng loÃƒÂ¡Ã‚ÂºÃ‚Â¡i ghÃƒÂ¡Ã‚ÂºÃ‚Â¿
                    List<ShowtimeSeatPrice> prices = List.of(
                            ShowtimeSeatPrice.builder().showtimeId(savedSt.getId()).seatType(SeatType.NORMAL).price(new BigDecimal("75000")).build(),
                            ShowtimeSeatPrice.builder().showtimeId(savedSt.getId()).seatType(SeatType.VIP).price(new BigDecimal("95000")).build(),
                            ShowtimeSeatPrice.builder().showtimeId(savedSt.getId()).seatType(SeatType.COUPLE).price(new BigDecimal("180000")).build()
                    );
                    showtimeSeatPriceRepository.saveAll(prices);
                }
            }
            log.info(">> Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ sinh cÃƒÆ’Ã‚Â¡c suÃƒÂ¡Ã‚ÂºÃ‚Â¥t chiÃƒÂ¡Ã‚ÂºÃ‚Â¿u vÃƒÆ’Ã‚Â  cÃƒÂ¡Ã‚ÂºÃ‚Â¥u hÃƒÆ’Ã‚Â¬nh giÃƒÆ’Ã‚Â¡ ghÃƒÂ¡Ã‚ÂºÃ‚Â¿ Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢ng mÃƒÂ¡Ã‚ÂºÃ‚Â«u cho ngÃƒÆ’Ã‚Â y hÃƒÆ’Ã‚Â´m nay");
        }
    }
}