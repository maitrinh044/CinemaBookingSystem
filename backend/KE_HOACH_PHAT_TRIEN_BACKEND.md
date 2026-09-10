# 🚀 KẾ HOẠCH PHÁT TRIỂN HỆ THỐNG BACKEND CINEMA BOOKING SERVICE (SPRING BOOT)
> **Phiên bản:** 2.0 (Chuẩn hóa 100% theo [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md))  
> **Kiến trúc:** Clean Architecture / Domain-Driven Design (DDD-lite)  
> **Công nghệ:** Java 21, Spring Boot 3.x, Spring Data JPA, PostgreSQL 16, Spring Security & JWT  

---

## 📑 MỤC LỤC
1. [Đối Chiếu Kiến Trúc Database & Phân Bổ Module](#1-đối-chiếu-kiến-trúc-database--phân-bổ-module)
2. [Lộ Trình Phát Triển 5 Giai Đoạn Chi Tiết](#2-lộ-trình-phát-triển-5-giai-đoạn-chi-tiết)
   - [Giai đoạn 1: Bảo Mật, Xác Thực (JWT + Refresh Token) & Quản Lý Users](#giai-đoạn-1-bảo-mật-xác-thực-jwt--refresh-token--quản-lý-users)
   - [Giai đoạn 2: Cụm Rạp (`cinemas`), Phòng Chiếu (`rooms`) & Ghế Ngồi (`seats`)](#giai-đoạn-2-cụm-rạp-cinemas-phòng-chiếu-rooms--ghế-ngồi-seats)
   - [Giai đoạn 3: Suất Chiếu (`showtimes`) & Bảng Giá Động (`showtime_seat_prices`)](#giai-đoạn-3-suất-chiếu-showtimes--bảng-giá-động-showtime_seat_prices)
   - [Giai đoạn 4: Đặt Vé (`bookings`), Khóa Ghế Concurrency (`booking_seats`) & Vé Điện Tử (`tickets`)](#giai-đoạn-4-đặt-vé-bookings-khóa-ghế-concurrency-booking_seats--vé-điện-tử-tickets)
   - [Giai đoạn 5: Thanh Toán Đa Kênh (`payments`), Thông Báo (`notifications`) & Data Seeder](#giai-đoạn-5-thanh-toán-đa-kênh-payments-thông-báo-notifications--data-seeder)
3. [Chi Tiết Cấu Trúc Mã Nguồn Theo Từng Bảng (JPA & Clean Architecture)](#3-chi-tiết-cấu-trúc-mã-nguồn-theo-từng-bảng)
4. [Bảng Đặc Tả API RESTful (API Specification)](#4-bảng-đặc-tả-api-restful)
5. [Chiến Lược Xử Lý Concurrency & Khóa Ghế An Toàn](#5-chiến-lược-xử-lý-concurrency--khóa-ghế-an-toàn)

---

## 1. ĐỐI CHIẾU KIẾN TRÚC DATABASE & PHÂN BỔ MODULE

Cơ sở dữ liệu gồm **11 bảng thực thể chính** và **8 kiểu Enum**. Hệ thống Backend Spring Boot được chia thành 6 module nghiệp vụ độc lập:

| Module Java (DDD Package) | Bảng Cơ Sở Dữ Liệu Tương Ứng | Kiểu Enum Sử Dụng | Nhiệm Vụ Nghiệp Vụ |
| :--- | :--- | :--- | :--- |
| **`auth` & `user`** | `users`, `refresh_tokens` | `user_role` (`USER`, `ADMIN`, `STAFF`) | Đăng ký, đăng nhập JWT, cấp lại access token qua refresh token, quản lý hồ sơ, phân quyền người dùng & nhân viên |
| **`movie`** *(Đã có)* | `movies`, `genres`, `movie_genres` | `movie_status` (`COMING_SOON`, `NOW_SHOWING`, `ENDED`) | Quản lý kho phim, phân loại thể loại N-N, tìm kiếm, phân trang và trạng thái phát hành |
| **`cinema`** | `cinemas`, `rooms`, `seats` | `seat_type` (`NORMAL`, `VIP`, `COUPLE`) | Quản lý mạng lưới rạp, phòng chiếu ma trận hàng/cột, và sơ đồ ghế ngồi chuẩn hóa |
| **`showtime`** | `showtimes`, `showtime_seat_prices` | `showtime_status` (`ACTIVE`, `CANCELLED`, `FINISHED`) | Lịch chiếu phim theo phòng, theo thời gian, quản lý bảng giá vé linh hoạt theo từng loại ghế |
| **`booking`** | `bookings`, `booking_seats`, `tickets` | `booking_status` (`PENDING`, `CONFIRMED`, `CANCELLED`, `EXPIRED`), `ticket_status` (`UNUSED`, `USED`, `CANCELLED`) | Giữ ghế chống trùng lặp tuyệt đối (`UNIQUE(showtime_id, seat_id)`), tạo đơn hàng, xuất vé điện tử kèm mã QR độc lập |
| **`payment`** | `payments` | `payment_method` (`CASH`, `VNPAY`, `MOMO`, `STRIPE`, `OTHER`), `payment_status` (`PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`) | Xử lý thanh toán, lưu vết mã giao dịch duy nhất `transaction_id`, webhook tích hợp cổng VNPay/MoMo |
| **`notification`** | `notifications` | - | Lưu và đẩy thông báo trạng thái vé, giao dịch thanh toán đến tài khoản người dùng |

---

## 2. LỘ TRÌNH PHÁT TRIỂN 5 GIAI ĐOẠN CHI TIẾT

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                   LỘ TRÌNH 5 GIAI ĐOẠN PHÁT TRIỂN BACKEND CHUẨN DATABASE SCHEMA                  │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┬──────────────────┤
│    GIAI ĐOẠN 1    │    GIAI ĐOẠN 2    │    GIAI ĐOẠN 3    │    GIAI ĐOẠN 4    │   GIAI ĐOẠN 5    │
│  User & Security  │  Cụm Rạp, Phòng   │    Suất Chiếu &   │  Giữ Ghế Chống    │   Thanh Toán     │
│  Refresh Token    │    & Ghế Ngồi     │   Bảng Giá Động   │  Trùng, Đặt Vé &  │   Thông Báo      │
│  CORS & Swagger   │ (cinemas, rooms,  │ (showtimes,       │  Vé QR (tickets)  │ (payments,       │
│  (users, tokens)  │  seats)           │  seat_prices)     │ (bookings, seats) │  notifications)  │
└───────────────────┴───────────────────┴───────────────────┴───────────────────┴──────────────────┘
```

---

### GIAI ĐOẠN 1: Bảo Mật, Xác Thực (JWT + Refresh Token) & Quản Lý Users
*Mục tiêu: Xây dựng hệ thống tài khoản vững chắc dựa trên bảng `users` và `refresh_tokens`, hỗ trợ phân quyền `USER`, `STAFF`, `ADMIN`.*

1. **Cấu hình Nền tảng & CORS (`CorsConfig.java`)**:
   - Cho phép Origin `http://localhost:5173` (Frontend Vite) kết nối toàn diện.
   - Thêm `springdoc-openapi-starter-webmvc-ui` để có Swagger UI tại `/swagger-ui.html`.
2. **Triển khai Entity & Repository cho `users`**:
   - Fields: `id`, `full_name`, `email` (unique), `phone` (unique), `password_hash`, `role` (`user_role`), `is_active`, `created_at`, `updated_at`.
   - Mã hóa mật khẩu bằng `BCryptPasswordEncoder`.
3. **Cơ chế Refresh Token (`refresh_tokens`)**:
   - Fields: `id`, `user_id` (FK), `token` (unique), `expires_at`, `revoked` (boolean), `created_at`.
   - Access Token có thời hạn ngắn (15-30 phút), Refresh Token có thời hạn 7-30 ngày.
   - Khi token hết hạn, client gọi `/api/auth/refresh-token` để cấp mới mà không bắt người dùng đăng nhập lại.
   - Khi logout hoặc đổi mật khẩu: Set `revoked = true` để vô hiệu hóa token ngay lập tức.
4. **Các Endpoint Cần Xây Dựng**:
   - `POST /api/auth/register`: Đăng ký tài khoản mới (mặc định role `USER`).
   - `POST /api/auth/login`: Đăng nhập, trả về `{ accessToken, refreshToken, user }`.
   - `POST /api/auth/refresh-token`: Cấp mới Access Token từ Refresh Token hợp lệ.
   - `POST /api/auth/logout`: Thu hồi token hiện tại.
   - `GET /api/users/me`: Lấy thông tin cá nhân của người dùng đang đăng nhập.
   - `PUT /api/users/me`: Cập nhật `full_name`, `phone`.
   - `PUT /api/users/change-password`: Đổi mật khẩu tài khoản.

---

### GIAI ĐOẠN 2: Cụm Rạp (`cinemas`), Phòng Chiếu (`rooms`) & Ghế Ngồi (`seats`)
*Mục tiêu: Số hóa toàn bộ không gian vật lý của rạp chiếu phim, định hình sơ đồ ghế theo phòng.*

1. **Module Cụm Rạp (`cinemas`)**:
   - Bảng `cinemas`: `name`, `address`, `city`, `district`, `phone`, `is_active`.
   - Hỗ trợ lọc danh sách rạp theo thành phố (`city`: Hồ Chí Minh, Hà Nội, Đà Nẵng...) phục vụ cho modal chọn khu vực của Frontend.
2. **Module Phòng Chiếu (`rooms`)**:
   - Bảng `rooms`: `cinema_id` (FK), `name` (Phòng 01, IMAX Laser, Phòng 02), `total_rows`, `total_columns`, `is_active`.
   - Cho phép định nghĩa kích thước lưới của phòng (ví dụ: 9 hàng x 12 cột = 108 ghế).
3. **Module Ghế Ngồi (`seats`)**:
   - Bảng `seats`: `room_id` (FK), `row_label` (A, B, C... J), `seat_number` (1, 2... 12), `seat_type` (`NORMAL`, `VIP`, `COUPLE`), `is_active`.
   - Mã định danh ghế hiển thị trực quan: `A1`, `B5`, `J9`...
   - Ghế đôi (`COUPLE`) được bố trí ở các hàng cuối cùng, hỗ trợ định dạng đặt theo cặp.
4. **Các Endpoint Cần Xây Dựng**:
   - `GET /api/cinemas`: Danh sách tất cả rạp (kèm query param `?city=...`).
   - `GET /api/cinemas/{id}`: Chi tiết rạp và danh sách các phòng chiếu.
   - `POST /api/cinemas` *(ADMIN)*: Thêm rạp mới.
   - `GET /api/rooms/{id}/seats`: Lấy toàn bộ ma trận ghế của một phòng chiếu.
   - `POST /api/rooms/{id}/generate-seats` *(ADMIN)*: Tự động sinh ma trận ghế theo `total_rows` và `total_columns`.

---

### GIAI ĐOẠN 3: Suất Chiếu (`showtimes`) & Bảng Giá Động (`showtime_seat_prices`)
*Mục tiêu: Kết nối Phim, Phòng Chiếu và Thời Gian, hỗ trợ bảng giá vé linh hoạt.*

1. **Module Suất Chiếu (`showtimes`)**:
   - Bảng `showtimes`: `movie_id` (FK), `room_id` (FK), `start_time`, `end_time`, `base_price`, `status` (`ACTIVE`, `CANCELLED`, `FINISHED`).
   - Ràng buộc nghiệp vụ: Không được phép tạo suất chiếu trùng giờ trong cùng một phòng (`start_time` và `end_time` không được chồng lấn).
   - Tự động tính `end_time = start_time + movie.duration_minutes + 15 phút dọn phòng`.
2. **Module Bảng Giá Theo Loại Ghế (`showtime_seat_prices`)**:
   - Bảng `showtime_seat_prices`: `showtime_id` (FK), `seat_type` (`NORMAL`, `VIP`, `COUPLE`), `price`.
   - **Ràng buộc duy nhất:** `UNIQUE (showtime_id, seat_type)` đảm bảo mỗi loại ghế trong một suất chiếu có đúng 1 mức giá xác định.
   - Cho phép định giá vé giờ vàng, cuối tuần linh hoạt (ví dụ: ghế thường 85k, VIP 110k, Couple 190k).
3. **Các Endpoint Cần Xây Dựng**:
   - `GET /api/showtimes`: Lọc suất chiếu đa tiêu chí (`?movieId=...&cinemaId=...&date=...`).
   - `GET /api/showtimes/{id}`: Chi tiết một suất chiếu (thông tin phim, phòng, rạp, bảng giá).
   - `GET /api/showtimes/{id}/seats`: **API quan trọng bậc nhất** - trả về sơ đồ ghế kèm trạng thái tức thời (`is_available`: true/false, giá tiền tương ứng từng ghế dựa trên `showtime_seat_prices`).
   - `POST /api/showtimes` *(STAFF/ADMIN)*: Lên lịch suất chiếu mới kèm bảng giá.

---

### GIAI ĐOẠN 4: Đặt Vé (`bookings`), Khóa Ghế Concurrency (`booking_seats`) & Vé Điện Tử (`tickets`)
*Mục tiêu: Xử lý quy trình đặt vé cốt lõi, chống đặt trùng ghế tuyệt đối và sinh vé điện tử mã QR.*

1. **Cơ Chế Giữ Ghế An Toàn (Anti-Double Booking & Seat Lock)**:
   - Bảng `booking_seats`: `booking_id` (FK), `showtime_id` (FK), `seat_id` (FK), `price`, `created_at`.
   - **Chỉ mục độc nhất:** `UNIQUE (showtime_id, seat_id)`.
   - Khi khách hàng chọn ghế và nhấn "Tiếp Tục":
     1. Tạo bản ghi `bookings` với trạng thái `PENDING`, thiết lập thời gian giữ chỗ `expires_at = now() + 5 phút`.
     2. Tạo các bản ghi trong `booking_seats`. Nếu có 2 khách hàng tranh chấp cùng 1 ghế, cơ sở dữ liệu sẽ ném ra lỗi `DataIntegrityViolationException`, Backend bắt lỗi và thông báo ngay: *"Ghế vừa được người khác giữ chỗ, vui lòng chọn ghế khác!"*.
2. **Tác Vụ Tự Động Giải Phóng Ghế Hết Hạn (Scheduled Job)**:
   - Sử dụng Spring `@Scheduled(fixedDelay = 30000)` (30 giây chạy 1 lần):
   - Quét các đơn `bookings` có `status = 'PENDING'` và `expires_at < now()`.
   - Cập nhật trạng thái sang `'EXPIRED'` và xóa/nhả các bản ghi `booking_seats` để khách hàng khác có thể đặt.
3. **Sinh Vé Điện Tử Từng Ghế (`tickets`)**:
   - Khi thanh toán thành công, hệ thống chuyển `bookings.status = 'CONFIRMED'`.
   - Tự động sinh bản ghi trong bảng `tickets` cho từng ghế (`booking_seat_id ➔ tickets 1-to-1`).
   - Sinh mã vé duy nhất `ticket_code` (ví dụ: `TK-2026-X8K9L2`).
   - Sinh chuỗi mã hóa `qr_code` (chứa chữ ký số để nhân viên tại cửa rạp quét kiểm tra tính hợp lệ).
4. **Các Endpoint Cần Xây Dựng**:
   - `POST /api/bookings/hold`: Tạo đơn đặt vé tạm thời, giữ ghế 5 phút.
   - `POST /api/bookings/{id}/cancel`: Người dùng chủ động hủy giữ chỗ.
   - `GET /api/bookings/my-bookings`: Danh sách lịch sử đơn đặt vé của người dùng.
   - `GET /api/bookings/{bookingCode}`: Chi tiết đơn đặt vé và danh sách vé QR.
   - `POST /api/tickets/check-in` *(STAFF)*: Quét mã QR soát vé tại cửa rạp, chuyển trạng thái `ticket_status` từ `UNUSED` sang `USED`.

---

### GIAI ĐOẠN 5: Thanh Toán Đa Kênh (`payments`), Thông Báo (`notifications`) & Data Seeder
*Mục tiêu: Hoàn tất luồng thanh toán thực tế, đẩy thông báo thời gian thực và nạp dữ liệu mẫu chạy ngay.*

1. **Module Thanh Toán (`payments`)**:
   - Bảng `payments`: `booking_id` (FK), `transaction_id` (unique), `payment_method` (`CASH`, `VNPAY`, `MOMO`, `STRIPE`, `OTHER`), `status` (`PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`), `amount`, `paid_at`.
   - Hỗ trợ luồng thanh toán VNPay QR / MoMo:
     - Tạo URL thanh toán chuyển hướng tới cổng thanh toán.
     - Tiếp nhận IPN Webhook từ cổng thanh toán để cập nhật `payments.status = SUCCESS` và kích hoạt chuyển `bookings.status = CONFIRMED`.
2. **Module Thông Báo (`notifications`)**:
   - Bảng `notifications`: `user_id` (FK), `title`, `content`, `is_read`, `created_at`, `read_at`.
   - Tự động tạo thông báo khi:
     - Đặt vé thành công (kèm mã vé và thời gian chiếu).
     - Nhắc nhở trước giờ chiếu 2 tiếng.
     - Cảnh báo đơn đặt vé sắp hết hạn thanh toán.
3. **Bộ Nạp Dữ Liệu Tự Động (`DataSeeder.java`)**:
   - Tự động kiểm tra và nạp sẵn dữ liệu khi chạy lần đầu:
     - 8 bộ phim bom tấn (*Dune 2, Mai, Godzilla x Kong, Oppenheimer...*).
     - 4 cụm rạp tại TP.HCM và Hà Nội.
     - Các phòng chiếu với đầy đủ sơ đồ ghế (Normal, VIP, Couple).
     - Suất chiếu trong ngày hôm nay và các ngày tiếp theo.
     - Tài khoản mẫu `admin@cinema.com` / `user@cinema.com` mật khẩu `123456`.

---

## 3. CHI TIẾT CẤU TRÚC MÃ NGUỒN THEO TỪNG BẢNG

Kiến trúc gói nguồn mở rộng trong `src/main/java/com/example/cinemabookingservice`:

```text
com.example.cinemabookingservice
│
├── auth                             # [GIAI ĐOẠN 1] Module Xác thực & JWT
│   ├── application/dto/             # LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest
│   ├── infrastructure/security/     # JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig
│   └── presentation/                # AuthController.java (/api/auth)
│
├── user                             # [GIAI ĐOẠN 1] Quản lý Người dùng & Token
│   ├── domain/                      # User.java, RefreshToken.java, UserRole.java
│   ├── infrastructure/persistence/  # UserEntity, RefreshTokenEntity, SpringDataUserRepository...
│   └── presentation/                # UserController.java (/api/users)
│
├── movie                            # [ĐÃ CÓ] Quản lý Phim & Thể loại
│   ├── domain/                      # Movie.java, Genre.java, MovieStatus.java
│   ├── infrastructure/persistence/  # MovieEntity, GenreEntity...
│   └── presentation/                # MovieController.java, GenreController.java
│
├── cinema                           # [GIAI ĐOẠN 2] Cụm rạp, Phòng & Ghế
│   ├── domain/                      # Cinema.java, Room.java, Seat.java, SeatType.java
│   ├── infrastructure/persistence/  # CinemaEntity, RoomEntity, SeatEntity...
│   └── presentation/                # CinemaController.java, RoomController.java
│
├── showtime                         # [GIAI ĐOẠN 3] Suất chiếu & Bảng giá ghế
│   ├── domain/                      # Showtime.java, ShowtimeSeatPrice.java, ShowtimeStatus.java
│   ├── infrastructure/persistence/  # ShowtimeEntity, ShowtimeSeatPriceEntity...
│   └── presentation/                # ShowtimeController.java
│
├── booking                          # [GIAI ĐOẠN 4] Đặt vé, Giữ ghế & Vé điện tử
│   ├── domain/                      # Booking.java, BookingSeat.java, Ticket.java
│   │                                # BookingStatus.java, TicketStatus.java
│   ├── infrastructure/persistence/  # BookingEntity, BookingSeatEntity, TicketEntity...
│   ├── infrastructure/scheduler/    # ExpiredBookingCleanupScheduler.java
│   └── presentation/                # BookingController.java, TicketController.java
│
├── payment                          # [GIAI ĐOẠN 5] Thanh toán & Cổng giao dịch
│   ├── domain/                      # Payment.java, PaymentMethod.java, PaymentStatus.java
│   ├── infrastructure/gateway/      # VnPayService.java, MoMoService.java
│   └── presentation/                # PaymentController.java
│
├── notification                     # [GIAI ĐOẠN 5] Thông báo người dùng
│   ├── domain/                      # Notification.java
│   ├── infrastructure/persistence/  # NotificationEntity...
│   └── presentation/                # NotificationController.java
│
└── shared                           # Thành phần dùng chung toàn hệ thống
    ├── response/                    # ApiResponse.java, PageResponse.java
    ├── exception/                   # GlobalExceptionHandler.java, AppException.java
    └── config/                      # CorsConfig.java, OpenApiConfig.java
```

---

## 4. BẢNG ĐẶC TẢ API RESTFUL

| Phân hệ | Phương thức | Endpoint | Phân quyền | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Đăng ký tài khoản mới |
| **Auth** | `POST` | `/api/auth/login` | Public | Đăng nhập nhận JWT Access & Refresh Token |
| **Auth** | `POST` | `/api/auth/refresh-token` | Public | Đổi Access Token mới bằng Refresh Token |
| **Auth** | `POST` | `/api/auth/logout` | Authenticated | Đăng xuất, vô hiệu hóa Refresh Token |
| **User** | `GET` | `/api/users/me` | Authenticated | Lấy thông tin tài khoản hiện tại |
| **User** | `PUT` | `/api/users/me` | Authenticated | Cập nhật họ tên, số điện thoại |
| **Movie** | `GET` | `/api/movies` | Public | Danh sách phim kèm phân trang & lọc trạng thái |
| **Movie** | `GET` | `/api/movies/{id}` | Public | Xem chi tiết phim |
| **Cinema** | `GET` | `/api/cinemas` | Public | Danh sách cụm rạp (hỗ trợ `?city=...`) |
| **Cinema** | `GET` | `/api/cinemas/{id}` | Public | Chi tiết cụm rạp và các phòng chiếu |
| **Showtime** | `GET` | `/api/showtimes` | Public | Tra cứu lịch chiếu theo phim, rạp, ngày |
| **Showtime** | `GET` | `/api/showtimes/{id}/seats`| Public | Lấy sơ đồ ghế kèm trạng thái trống/đã đặt/đang giữ & giá vé |
| **Booking** | `POST` | `/api/bookings/hold` | Authenticated | Giữ ghế 5 phút, tạo đơn hàng `PENDING` |
| **Booking** | `POST` | `/api/bookings/{id}/cancel`| Authenticated | Hủy giữ ghế chủ động |
| **Booking** | `GET` | `/api/bookings/my-bookings`| Authenticated | Danh sách lịch sử đặt vé của cá nhân |
| **Booking** | `GET` | `/api/bookings/code/{code}`| Authenticated | Tra cứu đơn vé và vé QR theo mã đơn hàng |
| **Payment** | `POST` | `/api/payments/create-url` | Authenticated | Tạo link thanh toán VNPay/MoMo |
| **Payment** | `GET` | `/api/payments/vnpay-ipn` | Public | Webhook xử lý kết quả thanh toán từ VNPay |
| **Ticket** | `POST` | `/api/tickets/check-in` | `STAFF`/`ADMIN`| Soát vé tại cửa rạp qua mã QR |
| **Noti** | `GET` | `/api/notifications` | Authenticated | Danh sách thông báo của tài khoản |
| **Noti** | `PATCH`| `/api/notifications/{id}/read`| Authenticated | Đánh dấu đã đọc thông báo |

---

## 5. CHIẾN LƯỢC XỬ LÝ CONCURRENCY & KHÓA GHẾ AN TOÀN

Để đảm bảo hệ thống **không bao giờ bị bán trùng ghế (Overbooking / Race Condition)** ngay cả khi có hàng ngàn người dùng cùng tranh nhau một suất chiếu bom tấn:

1. **Khóa Tầng Cơ Sở Dữ Liệu (Database Level Lock):**
   - Bảng `booking_seats` áp dụng ràng buộc duy nhất:
     ```sql
     UNIQUE (showtime_id, seat_id)
     ```
   - Đây là hàng phòng ngự cuối cùng vững chắc nhất. Không một tiến trình nào có thể chèn 2 dòng có cùng `showtime_id` và `seat_id`.
2. **Khóa Tầng Ứng Dụng (Pessimistic / Optimistic Locking):**
   - Tại tầng Service của Spring Boot, khi kiểm tra tình trạng ghế, câu lệnh JPA truy vấn sử dụng:
     ```java
     @Lock(LockModeType.PESSIMISTIC_WRITE)
     @Query("SELECT s FROM ShowtimeSeatEntity s WHERE s.showtime.id = :showtimeId AND s.seat.id IN :seatIds")
     ```
   - Đảm bảo việc đọc và ghi dữ liệu trạng thái ghế được thực hiện tuần tự, an toàn tuyệt đối.
3. **Cơ Chế Giải Phóng Ghế Tự Động:**
   - Mỗi đơn đặt vé `bookings` có cột `expires_at = now() + 5 phút`.
   - Nếu trong 5 phút người dùng không thanh toán thành công, đơn hàng tự động chuyển `EXPIRED` và nhả ghế cho người khác.
