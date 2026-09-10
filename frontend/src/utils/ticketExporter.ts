import type { CompletedBooking } from '../types/booking';

/**
 * Generates a high-resolution, cinema-grade PNG image of the E-Ticket
 * and automatically triggers browser download.
 */
export async function downloadTicketImage(booking: CompletedBooking): Promise<void> {
  const width = 800;
  const height = 1150;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Background Gradient (Luxury Cinema Velvet Dark)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0f1016');
  bgGrad.addColorStop(0.5, '#161922');
  bgGrad.addColorStop(1, '#0b0c10');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer border with subtle golden glow
  ctx.strokeStyle = '#2a2e3d';
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, width - 30, height - 30);

  // 2. Header Banner
  const headerGrad = ctx.createLinearGradient(0, 15, width, 140);
  headerGrad.addColorStop(0, '#e11d48');
  headerGrad.addColorStop(1, '#9f1239');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(15, 15, width - 30, 120);

  // CineGlow Logo & Brand Text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CINEGLOW CINEMA', width / 2, 75);

  ctx.fillStyle = '#fecdd3';
  ctx.font = '700 13px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('VÉ XEM PHIM ĐIỆN TỬ CHÍNH THỨC • E-TICKET', width / 2, 105);

  // 3. Movie Title & Age Rating
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(booking.movie.title, width / 2, 200);

  // Subtitle / Original Title & Format
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px "Segoe UI", Roboto, sans-serif';
  ctx.fillText(
    `${booking.movie.originalTitle} • ${booking.showtime.format} • ${booking.movie.duration} phút`,
    width / 2,
    235
  );

  // Age Rating Badge
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 50, 255, 100, 28, 8);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 14px "Segoe UI", Roboto, sans-serif';
  ctx.fillText(booking.movie.ageRating, width / 2, 274);

  // 4. Perforation Line (Dashed divider with side notches)
  const notchY = 320;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(40, notchY);
  ctx.lineTo(width - 40, notchY);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // Left notch circle cutout effect
  ctx.fillStyle = '#0f1016';
  ctx.beginPath();
  ctx.arc(15, notchY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right notch circle cutout effect
  ctx.beginPath();
  ctx.arc(width - 15, notchY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 5. Booking Details Grid
  const detailsY = 370;

  // Box 1: Rạp Chiếu & Phòng
  drawInfoCard(ctx, 45, detailsY, 340, 110, 'CỤM RẠP CHIẾU', booking.cinema.name, booking.showtime.hallName);

  // Box 2: Ngày & Giờ Chiếu
  drawInfoCard(ctx, 415, detailsY, 340, 110, 'SUẤT CHIẾU', booking.showtime.time, booking.date);

  // Box 3: Danh Sách Ghế Ngồi
  const seatsY = detailsY + 130;
  const seatsText = booking.seats.map((s) => s.id).join(', ');
  drawInfoCard(ctx, 45, seatsY, 340, 110, 'SỐ LƯỢNG GHẾ & MÃ GHẾ', `${booking.seats.length} Vé: ${seatsText}`, 'Phòng vé tiêu chuẩn VIP');

  // Box 4: Tổng Tiền Thanh Toán
  drawInfoCard(
    ctx,
    415,
    seatsY,
    340,
    110,
    'TỔNG TIỀN ĐÃ THANH TOÁN',
    `${booking.finalTotal.toLocaleString('vi-VN')} VNĐ`,
    'Đã thanh toán trực tuyến'
  );

  // 6. Concessions Section if any
  const comboY = seatsY + 130;
  if (booking.concessions && booking.concessions.length > 0) {
    const comboList = booking.concessions.map((c) => `${c.quantity}x ${c.item.name}`).join(' | ');
    drawInfoCard(ctx, 45, comboY, 710, 80, 'BẮP NƯỚC KÈM THEO', comboList, 'Xuất trình vé tại quầy Bar để nhận bắp nước');
  }

  // 7. QR Code & Barcode Section
  const codeBoxY = booking.concessions?.length ? comboY + 100 : comboY;
  
  // Card container for QR
  ctx.fillStyle = '#1e2230';
  ctx.beginPath();
  ctx.roundRect(45, codeBoxY, 710, 270, 16);
  ctx.fill();
  ctx.strokeStyle = '#2e3547';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw simulated QR Code
  drawSimulatedQRCode(ctx, 85, codeBoxY + 35, 200, booking.bookingCode);

  // Text beside QR
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 20px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('MÃ ĐẶT VÉ (BOOKING CODE)', 320, codeBoxY + 70);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 36px "Segoe UI", Roboto, monospace';
  ctx.fillText(booking.bookingCode, 320, codeBoxY + 120);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px "Segoe UI", Roboto, sans-serif';
  ctx.fillText('• Quét mã QR tại cổng soát vé rạp để vào phòng chiếu', 320, codeBoxY + 160);
  ctx.fillText('• Hoặc xuất trình mã vé tại quầy kiosk để in vé giấy nếu cần', 320, codeBoxY + 185);
  ctx.fillText(`• Khách hàng: ${booking.customerInfo.fullName} (${booking.customerInfo.phone})`, 320, codeBoxY + 210);

  // 8. Footer Barcode & Legal
  const barcodeY = codeBoxY + 295;
  drawSimulatedBarcode(ctx, width / 2, barcodeY, 500, 45);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CineGlow Cinema Vietnam • Hotline hỗ trợ: 1900 6868 • Vé không được hoàn trả sau giờ chiếu', width / 2, height - 35);

  // 9. Trigger browser download of PNG file
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CineGlow_VePhim_${booking.bookingCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      resolve();
    }, 'image/png');
  });
}

function drawInfoCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  category: string,
  mainText: string,
  subText: string
) {
  ctx.fillStyle = '#171a24';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = '#272b3a';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f43f5e';
  ctx.font = '700 11px "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(category, x + 20, y + 30);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 18px "Segoe UI", Roboto, sans-serif';
  // Truncate if too long
  const truncatedMain = mainText.length > 32 ? mainText.substring(0, 30) + '...' : mainText;
  ctx.fillText(truncatedMain, x + 20, y + 62);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "Segoe UI", Roboto, sans-serif';
  const truncatedSub = subText.length > 38 ? subText.substring(0, 36) + '...' : subText;
  ctx.fillText(truncatedSub, x + 20, y + 88);
}

function drawSimulatedQRCode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  code: string
) {
  // White background for QR code
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 10);
  ctx.fill();

  ctx.fillStyle = '#000000';
  const margin = 14;
  const cellSize = (size - margin * 2) / 21;

  // Corner Position Detection Markers (Standard QR Pattern)
  drawQRCornerSquare(ctx, x + margin, y + margin, cellSize * 7);
  drawQRCornerSquare(ctx, x + size - margin - cellSize * 7, y + margin, cellSize * 7);
  drawQRCornerSquare(ctx, x + margin, y + size - margin - cellSize * 7, cellSize * 7);

  // Deterministic random dots based on booking code hash
  let seed = 0;
  for (let i = 0; i < code.length; i++) {
    seed = (seed << 5) - seed + code.charCodeAt(i);
  }

  for (let row = 0; row < 21; row++) {
    for (let col = 0; col < 21; col++) {
      // Skip corners
      if ((row < 7 && col < 7) || (row < 7 && col > 13) || (row > 13 && col < 7)) {
        continue;
      }
      seed = (seed * 9301 + 49297) % 233280;
      if (seed / 233280 > 0.45) {
        ctx.fillRect(x + margin + col * cellSize, y + margin + row * cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawQRCornerSquare(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + s / 7, y + s / 7, s * 5 / 7, s * 5 / 7);
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + s * 2 / 7, y + s * 2 / 7, s * 3 / 7, s * 3 / 7);
}

function drawSimulatedBarcode(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  width: number,
  height: number
) {
  const startX = centerX - width / 2;
  let currentX = startX;
  ctx.fillStyle = '#cbd5e1';

  while (currentX < startX + width) {
    const barWidth = (currentX % 7 === 0 || currentX % 5 === 0) ? 3 : 1.5;
    const gap = (currentX % 3 === 0) ? 3 : 2;
    ctx.fillRect(currentX, y, barWidth, height);
    currentX += barWidth + gap;
  }
}
