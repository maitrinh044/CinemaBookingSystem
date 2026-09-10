# 🎬 CineGlow - Cinema Booking System

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

Hệ thống đặt vé xem phim trực tuyến hiện đại, tốc độ cao được xây dựng theo mô hình **Monorepo** bao gồm **Backend (Spring Boot)** và **Frontend (React TypeScript)**.

---

## 📁 Cấu trúc thư mục (Monorepo Layout)

```text
CinemaBookingSystem/
├── backend/                   # Spring Boot 3 (Clean Architecture / DDD-lite)
│   ├── src/main/java/         # Domain, Application, Infrastructure, Presentation
│   ├── src/main/resources/    # Cấu hình DB, JPA, Liquibase/Flyway
│   ├── pom.xml                # Quản lý Maven dependencies
│   └── mvnw / mvnw.cmd        # Maven Wrapper
│
├── frontend/                  # React 18 + Vite + TypeScript
│   ├── src/components/        # SeatMap, ETicketCard, HeroSlider, Header, Modals...
│   ├── src/pages/             # Home, Movies, Showtimes, Booking, Profile...
│   ├── src/services/          # API Client kết nối Backend (Axios, JWT interceptors)
│   ├── src/contexts/          # AuthContext, ThemeContext, ToastContext
│   ├── package.json           # Scripts & dependencies
│   └── vite.config.ts         # Vite build configuration
│
├── docker-compose.yml         # Khởi tạo PostgreSQL 16 & pgAdmin 4 local
├── DATABASE_SCHEMA.md         # Chi tiết sơ đồ cơ sở dữ liệu & mã DBML
├── KE_HOACH_PHAT_TRIEN.md     # Kế hoạch và Roadmap phát triển chi tiết
├── .gitignore                 # Bỏ qua node_modules, target, .idea, logs
└── README.md                  # Tài liệu giới thiệu hệ thống
```

---

## 🗄️ Sơ đồ cơ sở dữ liệu (Database ERD)

GitHub tự động hiển thị sơ đồ quan hệ thực thể (ERD) bên dưới:

```mermaid
erDiagram
    users ||--o{ refresh_tokens : "has"
    users ||--o{ reviews : "writes"
    users ||--o{ bookings : "places"

    movies ||--|{ movie_genres : "categorized_by"
    genres ||--|{ movie_genres : "includes"
    movies ||--o{ reviews : "receives"
    movies ||--o{ showtimes : "schedules"

    cinemas ||--|{ rooms : "contains"
    rooms ||--|{ seats : "has"
    rooms ||--o{ showtimes : "hosts"

    showtimes ||--|{ showtime_seats : "generates"
    seats ||--|{ showtime_seats : "maps_to"

    bookings ||--|{ booking_details : "includes"
    showtime_seats ||--o{ booking_details : "booked_in"

    bookings ||--|{ tickets : "issues"
    seats ||--|{ tickets : "assigned_to"
    showtimes ||--|{ tickets : "valid_for"

    bookings ||--o{ payments : "pays_for"

    users {
        bigint id PK
        varchar full_name
        varchar email "unique"
        varchar phone "unique"
        varchar password_hash
        varchar role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    refresh_tokens {
        bigint id PK
        bigint user_id FK
        varchar token "unique"
        timestamp expires_at
        timestamp created_at
    }

    movies {
        bigint id PK
        varchar title
        varchar slug "unique"
        text description
        varchar poster_url
        varchar trailer_url
        int duration
        date release_date
        varchar age_rating
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    genres {
        bigint id PK
        varchar name "unique"
        varchar slug "unique"
        timestamp created_at
    }

    movie_genres {
        bigint movie_id PK,FK
        bigint genre_id PK,FK
    }

    reviews {
        bigint id PK
        bigint user_id FK
        bigint movie_id FK
        int rating
        text comment
        timestamp created_at
    }

    cinemas {
        bigint id PK
        varchar name
        varchar address
        varchar city
        varchar hotline
        timestamp created_at
    }

    rooms {
        bigint id PK
        bigint cinema_id FK
        varchar name
        int total_seats
        timestamp created_at
    }

    seats {
        bigint id PK
        bigint room_id FK
        varchar seat_number
        varchar seat_row
        int seat_col
        varchar type
    }

    showtimes {
        bigint id PK
        bigint movie_id FK
        bigint room_id FK
        timestamp start_time
        timestamp end_time
        varchar status
        timestamp created_at
    }

    showtime_seats {
        bigint id PK
        bigint showtime_id FK
        bigint seat_id FK
        decimal price
        boolean is_available
    }

    bookings {
        bigint id PK
        bigint user_id FK
        varchar booking_code "unique"
        decimal total_amount
        varchar status
        timestamp created_at
    }

    booking_details {
        bigint id PK
        bigint booking_id FK
        bigint showtime_seat_id FK
        decimal price
    }

    payments {
        bigint id PK
        bigint booking_id FK
        varchar payment_method
        varchar payment_status
        varchar transaction_code "unique"
        decimal amount
        timestamp paid_at
    }

    tickets {
        bigint id PK
        bigint booking_id FK
        bigint seat_id FK
        bigint showtime_id FK
        varchar ticket_code "unique"
        varchar qr_code
        varchar status
        timestamp created_at
    }
```

> Chi tiết toàn bộ kiểu dữ liệu và mã DBML xem tại [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

---

## 🚀 Hướng dẫn khởi chạy (Quick Start)

### 1. Yêu cầu môi trường
- **Java**: OpenJDK 21 hoặc mới hơn
- **Node.js**: v18.x hoặc v20.x trở lên (kèm npm)
- **Docker & Docker Compose** (khuyên dùng để chạy nhanh Database)

---

### 2. Khởi động Cơ sở dữ liệu PostgreSQL
Khởi chạy container PostgreSQL 16 và pgAdmin:
```bash
docker compose up -d
```
- **PostgreSQL**: `localhost:5432` (User: `cinema_user`, Password: `cinema_password`, DB: `cinema_booking_db`)
- **pgAdmin**: Truy cập `http://localhost:5050` (Email: `admin@cinema.com`, Password: `admin`)

---

### 3. Khởi chạy Backend (Spring Boot)
Di chuyển vào thư mục `backend`:
```bash
cd backend
```
Chạy ứng dụng với Maven Wrapper:
```bash
# Trên Windows
.\mvnw.cmd spring-boot:run

# Trên Linux / macOS
./mvnw spring-boot:run
```
- Backend sẽ chạy tại: `http://localhost:8080`
- API Health Check: `http://localhost:8080/api/movies`

---

### 4. Khởi chạy Frontend (React Vite)
Mở một terminal mới và di chuyển vào thư mục `frontend`:
```bash
cd frontend

# Cài đặt thư viện
npm install

# Khởi chạy môi trường phát triển (Dev server)
npm run dev
```
- Truy cập giao diện ứng dụng tại: `http://localhost:5173`

---

## ✨ Tính năng nổi bật

- 🎬 **Trình duyệt phim đa dạng**: Phim đang chiếu, sắp chiếu, tìm kiếm tức thì, bộ lọc theo thể loại và rạp.
- 💺 **Sơ đồ chọn ghế tương tác thời gian thực**: Ghế thường, ghế VIP, ghế đôi Sweetbox với màn hình cong sống động và bảng chú thích trực quan.
- 🍿 **Combo Bắp Nước (Concessions)**: Tích hợp chọn combo bỏng nước kèm ưu đãi trước khi thanh toán.
- 💳 **Thanh toán đa phương thức**: Sẵn sàng tích hợp cổng VNPay, MoMo, Thẻ tín dụng/ghi nợ.
- 🎟️ **Vé điện tử (E-Ticket) & Mã QR**: Sinh vé điện tử tức thì kèm mã QR, hỗ trợ xuất và tải ảnh vé chất lượng cao.
- 🎨 **Đa dạng giao diện (4 Themes)**: Midnight Velvet (mặc định cao cấp), Cyberpunk Neon, Classic Dark, và Pearl Light.
- 📱 **Mobile-First & Responsive hoàn hảo**: Tối ưu mượt mà cho mọi kích thước màn hình từ điện thoại (390px) đến tablet và desktop.
- 🔔 **Hệ thống thông báo Toast cao cấp**: Cung cấp phản hồi người dùng tức thì khi đăng nhập, giữ ghế, thanh toán và hủy vé.

---

## 🛠️ Công nghệ sử dụng

| Phân hệ | Công nghệ |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3, Spring Data JPA, Hibernate, PostgreSQL, Clean Architecture |
| **Frontend** | React 18, Vite 5, TypeScript 5, React Router DOM, Canvas Confetti, Vanilla CSS Tokens |
| **DevOps** | Docker, Docker Compose, Git Monorepo |

---

## 📄 License & Tác giả
Dự án được phát triển phục vụ mục đích học tập và xây dựng hệ thống rạp chiếu phim chuyên nghiệp.
