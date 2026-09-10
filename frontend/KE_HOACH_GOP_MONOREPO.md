# Kế hoạch gộp Backend và Frontend thành 1 Monorepo (CinemaBookingSystem)

Tài liệu này mô tả chi tiết phương án và các bước tự động gộp hai dự án **CinemaBookingService** (Backend Spring Boot) và **CinemaBookingServiceFE** (Frontend React Vite) thành một Repository duy nhất chuẩn mực (**Monorepo**).

## User Review Required

> [!IMPORTANT]
> **Phương pháp an toàn (Non-destructive Copy):**
> Để đảm bảo không ảnh hưởng đến bất kỳ file hay tiến trình làm việc hiện tại, chúng ta sẽ sao chép (copy) source code sang thư mục Monorepo mới `d:\MaiTrinh\Dev\CinemaBookingSystem`, loại trừ các thư mục rác nặng như `node_modules`, `target`, `.git cũ`. Thư mục cũ `CinemaBookingService` và `CinemaBookingServiceFE` vẫn được giữ nguyên làm bản sao lưu an toàn!

> [!WARNING]
> **Vấn đề Git Submodule (Rất quan trọng):**
> Thư mục `CinemaBookingService` hiện tại đang có 1 thư mục con `.git`. Nếu đưa nguyên xi vào repo mới, GitHub sẽ coi đó là "Submodule" (thư mục màu xám có icon mũi tên, người xem không bấm vào xem code được). Chúng ta sẽ loại bỏ `.git` con bên trong `backend/` để Git theo dõi toàn bộ mã nguồn Java một cách bình thường.

---

## Cấu trúc thư mục Monorepo mới

```
d:\MaiTrinh\Dev\CinemaBookingSystem/
├── .git/                      <-- Git repository chính (nhánh main)
├── .gitignore                 <-- Bỏ qua node_modules, target, .env, .idea...
├── README.md                  <-- Giới thiệu hệ thống, hướng dẫn chạy, ERD Diagram
├── DATABASE_SCHEMA.md         <-- Toàn bộ sơ đồ ERD Mermaid & DBML
├── KE_HOACH_PHAT_TRIEN.md     <-- Kế hoạch roadmap phát triển Fullstack
├── docker-compose.yml         <-- Tiện ích chạy PostgreSQL & pgAdmin local
├── backend/                   <-- Toàn bộ mã nguồn Java Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
└── frontend/                  <-- Toàn bộ mã nguồn React Vite TypeScript
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.ts
```

---

## Các bước thực hiện

### Bước 1: Khởi tạo thư mục và sao chép source code
1. Tạo thư mục `d:\MaiTrinh\Dev\CinemaBookingSystem`.
2. Tạo thư mục con `backend/` và `frontend/`.
3. Sao chép toàn bộ mã nguồn `CinemaBookingService` vào `backend/` (loại trừ `.git`, `target`, `.idea`).
4. Sao chép toàn bộ mã nguồn `CinemaBookingServiceFE` vào `frontend/` (loại trừ `node_modules`, `dist`, `.git`).

### Bước 2: Tạo các tài liệu chuẩn Monorepo ở thư mục gốc
1. **`.gitignore`**: Chặn `node_modules/`, `dist/`, `target/`, `.idea/`, `.vscode/`, `.env`, `*.log`, `*.class`, `*.jar`.
2. **`README.md`**:
   - Tiêu đề & mô tả dự án rạp chiếu phim CineGlow.
   - Tech stack: Java 21, Spring Boot 3, PostgreSQL, React 18, Vite, TypeScript.
   - **Sơ đồ ERD Database hiển thị trực tiếp bằng Mermaid** (GitHub tự động render biểu đồ quan hệ 1-N, N-N giữa Users, Movies, Showtimes, Seats, Bookings, Tickets...).
   - Hướng dẫn cài đặt và khởi chạy: Backend (`./mvnw spring-boot:run`), Frontend (`npm install && npm run dev`).
3. **`DATABASE_SCHEMA.md`**: Giữ bản mô tả chi tiết schema và DBML.
4. **`KE_HOACH_PHAT_TRIEN.md`**: Bản kế hoạch phát triển Backend & Frontend đã hoàn thiện.
5. **`docker-compose.yml`**: Thiết lập sẵn PostgreSQL 16 và pgAdmin cho cơ sở dữ liệu `cinema_booking_db`.

### Bước 3: Khởi tạo Git & First Commit
1. Thực hiện `git init` tại `d:\MaiTrinh\Dev\CinemaBookingSystem`.
2. Chuyển nhánh mặc định sang `main`: `git branch -M main`.
3. `git add .` toàn bộ source code sạch.
4. `git commit -m "feat: initial commit - Cinema Booking System fullstack monorepo"`.

### Bước 4: Kiểm tra & Hướng dẫn lệnh push lên GitHub
1. Kiểm tra `git status` đảm bảo không có file rác bị commit.
2. Cung cấp câu lệnh đầy đủ để bạn chỉ cần dán URL GitHub repo của bạn vào là push lên ngay.

---

## Verification Plan

### Kiểm tra tính toàn vẹn của Monorepo:
1. Kiểm tra cấu trúc thư mục `d:\MaiTrinh\Dev\CinemaBookingSystem`: có đủ `backend`, `frontend`, `README.md`, `.gitignore`.
2. Kiểm tra `git log` và `git status` trong `CinemaBookingSystem`: đảm bảo toàn bộ file backend và frontend đều được git tracked, không bị submodule.
3. Chạy thử kiểm tra syntax: `npm run build` trong `frontend` để đảm bảo code không bị thiếu file nào.
