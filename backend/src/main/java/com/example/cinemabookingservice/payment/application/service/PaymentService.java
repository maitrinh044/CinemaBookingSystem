package com.example.cinemabookingservice.payment.application.service;

import com.example.cinemabookingservice.booking.application.service.BookingService;
import com.example.cinemabookingservice.booking.domain.Booking;
import com.example.cinemabookingservice.booking.domain.BookingStatus;
import com.example.cinemabookingservice.booking.domain.exception.BookingExpiredException;
import com.example.cinemabookingservice.booking.domain.exception.BookingNotFoundException;
import com.example.cinemabookingservice.booking.domain.repository.BookingRepository;
import com.example.cinemabookingservice.notification.application.service.NotificationService;
import com.example.cinemabookingservice.payment.application.dto.CreatePaymentRequest;
import com.example.cinemabookingservice.payment.application.dto.PaymentResponse;
import com.example.cinemabookingservice.payment.domain.Payment;
import com.example.cinemabookingservice.payment.domain.PaymentMethod;
import com.example.cinemabookingservice.payment.domain.PaymentStatus;
import com.example.cinemabookingservice.payment.domain.exception.PaymentAlreadyCompletedException;
import com.example.cinemabookingservice.payment.domain.exception.PaymentNotFoundException;
import com.example.cinemabookingservice.payment.domain.repository.PaymentRepository;
import com.example.cinemabookingservice.payment.infrastructure.vnpay.VNPayConfig;
import com.example.cinemabookingservice.user.domain.User;
import com.example.cinemabookingservice.user.domain.exception.UserNotFoundException;
import com.example.cinemabookingservice.user.domain.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request, String userEmail, HttpServletRequest httpRequest) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn hàng ID: " + request.getBookingId()));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        if (!booking.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("Đơn hàng này không thuộc về tài khoản của bạn");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new PaymentAlreadyCompletedException("Đơn hàng này đã được thanh toán và xuất vé thành công trước đó!");
        }

        if (booking.getStatus() == BookingStatus.EXPIRED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingExpiredException("Đơn hàng đã hết hạn hoặc đã bị hủy, không thể tiến hành thanh toán!");
        }

        LocalDateTime now = LocalDateTime.now();
        if (booking.getExpiresAt() != null && booking.getExpiresAt().isBefore(now)) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw new BookingExpiredException("Thời gian giữ chỗ 5 phút đã hết, vui lòng chọn lại ghế!");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElse(null);

        if (payment == null) {
            payment = Payment.builder()
                    .bookingId(booking.getId())
                    .paymentMethod(request.getPaymentMethod())
                    .status(PaymentStatus.PENDING)
                    .amount(booking.getTotalAmount())
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
        } else {
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus(PaymentStatus.PENDING);
            payment.setUpdatedAt(now);
        }

        // Xử lý theo phương thức
        if (request.getPaymentMethod() == PaymentMethod.CASH) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(now);
            payment.setTransactionId("CASH-" + System.currentTimeMillis());
            Payment savedPayment = paymentRepository.save(payment);

            // Kích hoạt vé & xác nhận đơn
            bookingService.confirmBookingAndIssueTickets(booking.getId());

            // Gửi thông báo
            notificationService.createNotification(
                    booking.getUserId(),
                    "Đặt vé thành công",
                    "Đơn đặt vé #" + booking.getBookingCode() + " đã được xác nhận thanh toán tiền mặt thành công. Chúc bạn xem phim vui vẻ!"
            );

            return mapToResponse(savedPayment, booking.getBookingCode(), null);
        }

        Payment savedPayment = paymentRepository.save(payment);
        String paymentUrl = generateVNPayUrl(booking, httpRequest);
        return mapToResponse(savedPayment, booking.getBookingCode(), paymentUrl);
    }

    @Transactional
    public PaymentResponse processVNPayCallback(Map<String, String> params) {
        String vnpResponseCode = params.get("vnp_ResponseCode");
        String vnpTxnRef = params.get("vnp_TxnRef");
        String vnpTransactionNo = params.get("vnp_TransactionNo");

        if (vnpTxnRef == null) {
            throw new IllegalArgumentException("Tham số vnp_TxnRef không hợp lệ");
        }

        Long bookingId;
        try {
            bookingId = Long.parseLong(vnpTxnRef);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Mã booking trong vnp_TxnRef không hợp lệ");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn hàng ID: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new PaymentNotFoundException("Không tìm thấy thông tin thanh toán cho đơn hàng"));

        LocalDateTime now = LocalDateTime.now();
        if ("00".equals(vnpResponseCode)) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(vnpTransactionNo != null ? vnpTransactionNo : "VNPAY-" + System.currentTimeMillis());
            payment.setPaidAt(now);
            payment.setUpdatedAt(now);
            Payment savedPayment = paymentRepository.save(payment);

            // Xác nhận đơn hàng & xuất vé QR
            bookingService.confirmBookingAndIssueTickets(booking.getId());

            // Gửi thông báo
            notificationService.createNotification(
                    booking.getUserId(),
                    "Thanh toán VNPay thành công",
                    "Đơn đặt vé #" + booking.getBookingCode() + " đã được thanh toán thành công qua VNPay. Vé điện tử đã sẵn sàng!"
            );

            return mapToResponse(savedPayment, booking.getBookingCode(), null);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(now);
            Payment savedPayment = paymentRepository.save(payment);
            return mapToResponse(savedPayment, booking.getBookingCode(), null);
        }
    }

    @Transactional
    public PaymentResponse simulateSuccess(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn hàng ID: " + bookingId));

        LocalDateTime now = LocalDateTime.now();
        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(null);
        if (payment == null) {
            payment = Payment.builder()
                    .bookingId(booking.getId())
                    .paymentMethod(PaymentMethod.VNPAY)
                    .amount(booking.getTotalAmount())
                    .createdAt(now)
                    .build();
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId("SIM-" + System.currentTimeMillis());
        payment.setPaidAt(now);
        payment.setUpdatedAt(now);
        Payment savedPayment = paymentRepository.save(payment);

        // Kích hoạt vé & chuyển đơn sang CONFIRMED
        bookingService.confirmBookingAndIssueTickets(booking.getId());

        // Gửi thông báo
        notificationService.createNotification(
                booking.getUserId(),
                "Thanh toán thành công (Mô phỏng)",
                "Đơn hàng #" + booking.getBookingCode() + " đã được xác nhận thanh toán thành công. Vé xem phim đã được sinh mã QR!"
        );

        return mapToResponse(savedPayment, booking.getBookingCode(), null);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Không tìm thấy đơn hàng ID: " + bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new PaymentNotFoundException("Chưa có giao dịch thanh toán cho đơn này"));

        return mapToResponse(payment, booking.getBookingCode(), null);
    }

    private String generateVNPayUrl(Booking booking, HttpServletRequest request) {
        long amountInVnd = booking.getTotalAmount().longValue() * 100;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNPayConfig.VNP_VERSION);
        vnp_Params.put("vnp_Command", VNPayConfig.VNP_COMMAND);
        vnp_Params.put("vnp_TmnCode", VNPayConfig.VNP_TMNCODE);
        vnp_Params.put("vnp_Amount", String.valueOf(amountInVnd));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", String.valueOf(booking.getId()));
        vnp_Params.put("vnp_OrderInfo", "Thanh toan ve xem phim don hang " + booking.getBookingCode());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", "http://localhost:5173/payment-result");
        vnp_Params.put("vnp_IpAddr", request != null ? request.getRemoteAddr() : "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (UnsupportedEncodingException e) {
                    // Ignore
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.VNP_HASHSECRET, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return VNPayConfig.VNP_PAYURL + "?" + queryUrl;
    }

    private PaymentResponse mapToResponse(Payment p, String bookingCode, String paymentUrl) {
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBookingId())
                .bookingCode(bookingCode)
                .transactionId(p.getTransactionId())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus())
                .amount(p.getAmount())
                .paymentUrl(paymentUrl)
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .build();
    }
}