import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCart from '../context/cart-context';

export default function Login() {
  const navigate = useNavigate();
  const { updateToken } = useCart();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // Cập nhật giá trị input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://freshmilk.free.nf/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!res.ok) throw new Error("Sai email hoặc mật khẩu");

      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role_id", data.user.role_id);
      updateToken(data.access_token);

      const redirectAfterLogin = localStorage.getItem("post_login_redirect");

      if (data.user.role_id === 1) {
        navigate("/admin/dashboard");
      } else if (redirectAfterLogin) {
        localStorage.removeItem("post_login_redirect");
        navigate(redirectAfterLogin);
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập bằng mạng xã hội
  useEffect(() => {
    const checkSocialLogin = async () => {
      const socialToken = searchParams.get('social_token');

      if (socialToken) {
        // 1. Lưu token tạm thời
        localStorage.setItem('access_token', socialToken);
        updateToken(socialToken); // Cập nhật Context

        try {
          // 2. Gọi API về Backend để lấy thông tin User chính xác
          const res = await fetch("https://freshmilk.free.nf/api/current_user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${socialToken}`,
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) {
            throw new Error("Không thể lấy thông tin người dùng");
          }

          const userData = await res.json();

          // 3. Lưu thêm thông tin cần thiết (nếu cần)
          localStorage.setItem("role_id", userData.role_id);

          if (userData.role_id === 1) {
            navigate('/admin/dashboard');
          } else {
            // Kiểm tra xem trước đó có trang nào cần redirect không (ví dụ đang mua hàng dở)
            const redirectAfterLogin = localStorage.getItem("post_login_redirect");
            if (redirectAfterLogin) {
              localStorage.removeItem("post_login_redirect");
              navigate(redirectAfterLogin);
            } else {
              navigate('/');
            }
          }

        } catch (err) {
          console.error("Lỗi xác thực Google:", err);
          alert("Lỗi đăng nhập: Không thể lấy thông tin tài khoản.");
          navigate('/login');
        }
      }
    };

    checkSocialLogin();
  }, [searchParams, navigate, updateToken]);

  // Chuyển hướng sang Google Login
  const handleGoogleLogin = () => {
    window.location.href = "https://freshmilk.free.nf/auth/google";
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark bg-center bg-cover"
      style={{
        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoPRMiMRYZ0Rf-LKBOAneZPGJiYOlGpd3TO4XJtLEBNYpEJ88jxGgvo4bYwoA-nS0KCYEMaJl54_bKSGwW5QnlmRYSRb70j-OVwaTeHChoPXsw73aBAHeJpXL3vamOe7IfOkAcJmSRN99EjGT5Qw5lNuCaXkgEMNHXzYCFAPdcaDeVEDOw91v9Jr-cjvD_N2w2M3gJCJEgye4sVhosZDEzM7vOasgOgAXmS3jlPUTuAJhCyV9VTcPh4nZnLGRlBPNzqqWAlIyxQvs')",
      }}
    >
      <div className="absolute inset-0 bg-background-light/70 dark:bg-background-dark/80 backdrop-blur-sm"></div>

      <div className="relative m-4 w-full max-w-md flex flex-col items-center justify-center rounded-xl bg-white/80 dark:bg-background-dark/80 p-8 shadow-2xl backdrop-blur-lg">

        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <svg
            className="h-12 w-12 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              d="M3.75 13.5l-1.148 1.148a.75.75 0 001.06 1.06l1.148-1.148M16.5 6.75l-1.148 1.148a.75.75 0 101.06 1.06l1.148-1.148M6.75 19.5l-1.148 1.148a.75.75 0 001.06 1.06l1.148-1.148M16.5 13.5l1.148 1.148a.75.75 0 01-1.06 1.06l-1.148-1.148M10.5 1.5a.75.75 0 00-.75.75v19.5a.75.75 0 001.5 0V2.25a.75.75 0 00-.75-.75z"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <p className="text-3xl font-black text-slate-800 dark:text-white">Chào mừng!</p>
          <p className="text-base text-slate-600 dark:text-slate-300">Tạo tài khoản cho riêng bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <label className="flex flex-col w-full">
            <p className="pb-2 text-sm font-medium text-slate-800 dark:text-slate-200">Email</p>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="form-input flex h-12 w-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/50 p-3 text-base text-slate-800 dark:text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/40 rounded-l-lg"
                required
              />
              <div className="flex items-center justify-center bg-white/70 dark:bg-slate-800/50 px-3 rounded-r-lg text-slate-500">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
            </div>
          </label>

          <label className="flex flex-col w-full">
            <p className="pb-2 text-sm font-medium text-slate-800 dark:text-slate-200">Password</p>
            <div className="flex w-full items-stretch rounded-lg">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="form-input flex h-12 w-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/50 p-3 text-base text-slate-800 dark:text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/40 rounded-l-lg"
                required
              />
              <div className="flex items-center justify-center bg-white/70 dark:bg-slate-800/50 px-3 rounded-r-lg text-slate-500">
                <span className="material-symbols-outlined text-xl">visibility</span>
              </div>
            </div>
          </label>

          <span className="text-sm font-medium text-primary hover:underline text-right mt-1 cursor-pointer">
            Quên mật khẩu?
          </span>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-bold text-white shadow-md transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 mt-2"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="w-full mt-6">
          <div className="relative flex items-center justify-center w-full mb-4">
            <div className="absolute w-full border-t border-slate-300 dark:border-slate-600"></div>
            <span className="relative bg-white/0 px-2 text-sm text-slate-500 dark:text-slate-400 backdrop-blur-sm">
              Hoặc tiếp tục với
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white transition-all hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-semibold text-slate-700 dark:text-white">
                Đăng nhập với Google
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/registration")}
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
