package com.example.cinemabookingservice.payment.presentation;

import com.example.cinemabookingservice.payment.application.dto.CreatePaymentRequest;
import com.example.cinemabookingservice.payment.application.dto.PaymentResponse;
import com.example.cinemabookingservice.payment.application.service.PaymentService;
import com.example.cinemabookingservice.shared.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-url")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @Valid @RequestBody CreatePaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest httpRequest
    ) {
        PaymentResponse response = paymentService.createPayment(request, userDetails.getUsername(), httpRequest);
        return ResponseEntity.ok(ApiResponse.success("Khởi tạo thanh toán thành công", response));
    }

    @GetMapping("/vnpay-callback")
    public ResponseEntity<ApiResponse<PaymentResponse>> vnpayCallback(
            @RequestParam Map<String, String> allParams
    ) {
        PaymentResponse response = paymentService.processVNPayCallback(allParams);
        return ResponseEntity.ok(ApiResponse.success("Xử lý kết quả thanh toán VNPay thành công", response));
    }

    @PostMapping("/simulate-success/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> simulateSuccess(
            @PathVariable Long bookingId
    ) {
        PaymentResponse response = paymentService.simulateSuccess(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Mô phỏng thanh toán thành công và xuất vé QR hoàn tất!", response));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBooking(
            @PathVariable Long bookingId
    ) {
        PaymentResponse response = paymentService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thanh toán thành công", response));
    }
}