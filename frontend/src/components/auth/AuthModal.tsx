import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authTab, 
    setAuthTab, 
    login, 
    loginAsDemo, 
    register 
  } = useAuth();

  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAgreeTerms, setRegAgreeTerms] = useState(true);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Error message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      const msg = 'Vui lòng nhập đầy đủ Email và Mật khẩu.';
      setErrorMsg(msg);
      toast.warning('Đăng nhập chưa hoàn tất', msg);
      return;
    }

    if (!loginEmail.includes('@')) {
      const msg = 'Định dạng Email không hợp lệ.';
      setErrorMsg(msg);
      toast.error('Email không hợp lệ', msg);
      return;
    }

    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      const msg = 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.';
      setErrorMsg(msg);
      toast.warning('Thông tin chưa đủ', msg);
      return;
    }

    if (!regEmail.includes('@')) {
      const msg = 'Định dạng Email không hợp lệ.';
      setErrorMsg(msg);
      toast.error('Email không hợp lệ', msg);
      return;
    }

    if (regPhone.trim().length < 9) {
      const msg = 'Số điện thoại không hợp lệ (tối thiểu 9 số).';
      setErrorMsg(msg);
      toast.error('Số điện thoại sai', msg);
      return;
    }

    if (regPassword.length < 6) {
      const msg = 'Mật khẩu phải có ít nhất 6 ký tự.';
      setErrorMsg(msg);
      toast.warning('Mật khẩu quá ngắn', msg);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      const msg = 'Mật khẩu xác nhận không khớp.';
      setErrorMsg(msg);
      toast.error('Mật khẩu không khớp', msg);
      return;
    }

    if (!regAgreeTerms) {
      const msg = 'Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục.';
      setErrorMsg(msg);
      toast.warning('Chưa đồng ý điều khoản', msg);
      return;
    }

    register(regName, regEmail, regPhone, regPassword);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      const msg = 'Vui lòng nhập địa chỉ Email hợp lệ.';
      setErrorMsg(msg);
      toast.error('Email không hợp lệ', msg);
      return;
    }

    setForgotSent(true);
    toast.success('Đã gửi email khôi phục!', `Vui lòng kiểm tra hộp thư đến của ${forgotEmail}.`);
  };

  const handleTabSwitch = (tab: 'login' | 'register' | 'forgot') => {
    setErrorMsg(null);
    setForgotSent(false);
    setAuthTab(tab);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      size="md"
      title={
        authTab === 'login'
          ? 'Đăng Nhập Tài Khoản CineGlow'
          : authTab === 'register'
          ? 'Đăng Ký Thành Viên CineGlow'
          : 'Khôi Phục Mật Khẩu'
      }
    >
      <div className="space-y-5 text-left">
        {/* Tab Switcher Pills (Only when not in forgot view) */}
        {authTab !== 'forgot' && (
          <div className="flex rounded-xl bg-[var(--surface-hover)] p-1 border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                authTab === 'login'
                  ? 'bg-[var(--surface)] text-[var(--text-main)] shadow-sm'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                authTab === 'register'
                  ? 'bg-[var(--surface)] text-[var(--text-main)] shadow-sm'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {authTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* 1-Click Demo Login Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--primary)]/10 via-[var(--gold)]/10 to-transparent border border-[var(--border-color)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[var(--text-main)] block">Dùng thử nhanh</span>
                  <span className="text-[10px] text-[var(--text-sub)]">Đăng nhập tài khoản mẫu trong 1 click</span>
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={loginAsDemo}
                className="text-xs py-1 px-3 shadow-sm shadow-red-600/30 shrink-0"
              >
                Đăng Nhập Demo
              </Button>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-sub)]">
                Email hoặc Tên đăng nhập
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="nhap-email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--text-sub)]">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('forgot')}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="login-remember"
                checked={loginRemember}
                onChange={(e) => setLoginRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer accent-[var(--primary)]"
              />
              <label htmlFor="login-remember" className="text-xs text-[var(--text-sub)] cursor-pointer select-none">
                Ghi nhớ đăng nhập trên thiết bị này
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-lg shadow-red-600/30"
            >
              Đăng Nhập
            </Button>

            {/* Social Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="w-full border-t border-[var(--border-color)]" />
              <span className="absolute bg-[var(--surface)] px-3 text-[11px] text-[var(--text-sub)] font-medium">
                Hoặc tiếp tục với
              </span>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={loginAsDemo}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={loginAsDemo}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Switch to Register */}
            <div className="text-center text-xs text-[var(--text-sub)] pt-1">
              Chưa có tài khoản CineGlow?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className="font-bold text-[var(--primary)] hover:underline cursor-pointer"
              >
                Đăng ký thành viên ngay
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {authTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-sub)]">
                Họ và tên
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-sub)]">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-sub)]">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-sub)]">
                  Mật khẩu (tối thiểu 6 ký tự)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-sub)]">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="reg-agree"
                checked={regAgreeTerms}
                onChange={(e) => setRegAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-600 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer accent-[var(--primary)]"
              />
              <label htmlFor="reg-agree" className="text-[11px] text-[var(--text-sub)] cursor-pointer leading-tight select-none">
                Tôi đồng ý với <span className="text-[var(--primary)] font-semibold">Điều khoản sử dụng</span> và <span className="text-[var(--primary)] font-semibold">Chính sách bảo mật thành viên</span> của CineGlow Cinema.
              </label>
            </div>

            {/* Register Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-lg shadow-red-600/30"
            >
              Đăng Ký Thành Viên (+50 CinePoint)
            </Button>

            {/* Switch to Login */}
            <div className="text-center text-xs text-[var(--text-sub)] pt-1">
              Đã có tài khoản CineGlow?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className="font-bold text-[var(--primary)] hover:underline cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD FORM */}
        {authTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            {forgotSent ? (
              <div className="text-center space-y-3 py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-main)]">
                  Đã Gửi Hướng Dẫn Khôi Phục
                </h4>
                <p className="text-xs text-[var(--text-sub)]">
                  Vui lòng kiểm tra hộp thư đến của <b>{forgotEmail}</b> để nhận liên kết thiết lập lại mật khẩu mới.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleTabSwitch('login')}
                  className="mt-2"
                >
                  Quay Lại Đăng Nhập
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-[var(--text-sub)]">
                  Nhập địa chỉ email đăng ký tài khoản của bạn. Hệ thống sẽ gửi đường dẫn khôi phục mật khẩu trong giây lát.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-sub)]">
                    Email của bạn
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--text-sub)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full shadow-lg shadow-red-600/30"
                >
                  Gửi Liên Kết Đặt Lại Mật Khẩu
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className="text-xs font-semibold text-[var(--text-sub)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    ← Quay lại Đăng nhập
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </Modal>
  );
};
