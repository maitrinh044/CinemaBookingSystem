import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Tag, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { CustomerInfo, PaymentMethod } from '../../types/booking';

export interface CheckoutStepProps {
  customerInfo: CustomerInfo;
  onUpdateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  voucherCode: string;
  discountAmount: number;
  onApplyVoucher: (code: string) => { success: boolean; message: string; discount: number };
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({
  customerInfo,
  onUpdateCustomerInfo,
  voucherCode,
  discountAmount,
  onApplyVoucher,
  paymentMethod,
  onSelectPaymentMethod,
}) => {
  const [inputVoucher, setInputVoucher] = useState(voucherCode);
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyVoucher = () => {
    if (!inputVoucher.trim()) return;
    const res = onApplyVoucher(inputVoucher.trim().toUpperCase());
    setVoucherMsg({ text: res.message, isError: !res.success });
  };

  const paymentOptions: { id: PaymentMethod; name: string; desc: string; icon: string }[] = [
    {
      id: 'momo',
      name: 'Ví Điện Tử MoMo',
      desc: 'Quét mã QR MoMo thanh toán siêu tốc trong 1 chạm',
      icon: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=100&auto=format&fit=crop&q=60',
    },
    {
      id: 'vnpay',
      name: 'VNPAY-QR / Mobile Banking',
      desc: 'Hỗ trợ hơn 40 ứng dụng ngân hàng tại Việt Nam',
      icon: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=60',
    },
    {
      id: 'zalopay',
      name: 'Ví Điện Tử ZaloPay',
      desc: 'Thanh toán trực tiếp qua ví hoặc thẻ liên kết',
      icon: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=60',
    },
    {
      id: 'card',
      name: 'Thẻ Quốc Tế Visa / MasterCard / JCB',
      desc: 'Thẻ tín dụng / ghi nợ quốc tế bảo mật 3D-Secure',
      icon: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=100&auto=format&fit=crop&q=60',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* 1. Customer Information Section */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
          <User className="w-4 h-4 text-[var(--primary)]" />
          <span>1. Thông Tin Người Nhận Vé</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-sub)]">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={customerInfo.fullName}
                onChange={(e) => onUpdateCustomerInfo({ fullName: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-sub)]">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="0912 345 678"
                value={customerInfo.phone}
                onChange={(e) => onUpdateCustomerInfo({ phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-[var(--text-sub)]">
              Email nhận vé điện tử <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="email@example.com"
                value={customerInfo.email}
                onChange={(e) => onUpdateCustomerInfo({ email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-sub)] flex items-center gap-1 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Mã vé điện tử và hóa đơn VAT sẽ được gửi tự động đến Email và SMS của bạn ngay sau khi thanh toán.</span>
        </p>
      </div>

      {/* 2. Voucher / Discount Code */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] space-y-3">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
          <Tag className="w-4 h-4 text-[var(--gold)]" />
          <span>2. Mã Khuyến Mãi / Voucher</span>
        </div>

        <div className="flex items-center gap-2 max-w-md">
          <input
            type="text"
            placeholder="Nhập mã (Gợi ý: CINEVIP, GIAM20K)"
            value={inputVoucher}
            onChange={(e) => setInputVoucher(e.target.value.toUpperCase())}
            className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-bold text-[var(--text-main)] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
          />
          <button
            type="button"
            onClick={handleApplyVoucher}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold hover:bg-[var(--primary-hover)] transition-colors cursor-pointer shrink-0 shadow-md shadow-red-600/30"
          >
            Áp Dụng
          </button>
        </div>

        {discountAmount > 0 && (
          <div className="text-xs font-semibold text-emerald-500">
            ✓ Đã áp dụng giảm {discountAmount.toLocaleString('vi-VN')} đ vào tổng thanh toán.
          </div>
        )}

        {voucherMsg && (
          <div className={`text-xs font-semibold flex items-center gap-1.5 ${
            voucherMsg.isError ? 'text-rose-500' : 'text-emerald-500'
          }`}>
            {voucherMsg.isError ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{voucherMsg.text}</span>
          </div>
        )}
      </div>

      {/* 3. Payment Method Selection */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-main)]">
          <CreditCard className="w-4 h-4 text-[var(--primary)]" />
          <span>3. Phương Thức Thanh Toán</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentOptions.map((opt) => {
            const isSelected = paymentMethod === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => onSelectPaymentMethod(opt.id)}
                className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/40 shadow-md'
                    : 'border-[var(--border-color)] bg-[var(--surface-hover)] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                      : 'border-slate-500 bg-transparent'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                      {opt.name}
                    </h4>
                    <p className="text-[11px] text-[var(--text-sub)] line-clamp-1">
                      {opt.desc}
                    </p>
                  </div>
                </div>

                <QrCode className={`w-5 h-5 shrink-0 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-sub)]'}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
