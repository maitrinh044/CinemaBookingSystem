package com.example.cinemabookingservice.showtime.infrastructure.persistence.entity;

import com.example.cinemabookingservice.cinema.domain.SeatType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "showtime_seat_prices", uniqueConstraints = {
        @UniqueConstraint(name = "uk_showtime_seat_type", columnNames = {"showtime_id", "seat_type"})
}, indexes = {
        @Index(name = "idx_seat_prices_showtime_id", columnList = "showtime_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeSeatPriceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "showtime_id", nullable = false)
    private Long showtimeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_type", nullable = false, length = 20)
    private SeatType seatType;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}