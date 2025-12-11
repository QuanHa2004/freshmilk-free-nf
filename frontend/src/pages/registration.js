import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // Cập nhật giá trị input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không giống!");
      return;
    }

    try {
      const res = await fetch("https://freshmilk.free.nf/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
          role_id: 2
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Đăng ký thất bại");
      }

      setMessage(data.message);

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="font-display">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark overflow-x-hidden p-4 sm:p-6">
        <div className="flex flex-col items-center w-full max-w-md">

          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">water_drop</span>
            <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">FreshMilk</h2>
          </div>

          <div className="w-full bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">

              <h1 className="text-text-light dark:text-text-dark text-2xl sm:text-3xl font-bold pb-4 text-center">
                Tạo tài khoản
              </h1>

              <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                Tham gia cùng chúng tôi
              </p>

              <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                {[
                  { name: "full_name", label: "Tên của bạn:", type: "text", placeholder: "Nhập tên đầy đủ của bạn" },
                  { name: "email", label: "Email", type: "email", placeholder: "Nhập email của bạn" },
                  { name: "phone", label: "SĐT", type: "tel", placeholder: "Nhập số điện thoại của bạn" },
                  { name: "address", label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ nhà của bạn" },
                  { name: "password", label: "Mật khẩu", type: "password", placeholder: "Nhập mật khẩu của bạn" },
                  { name: "confirmPassword", label: "Xác nhận mật khẩu", type: "password", placeholder: "Nhập lại mật khẩu" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col w-full">
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium pb-2">
                        {field.label}
                      </p>
                      <input
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.name !== "phone" && field.name !== "address"}
                        className="form-input flex h-12 w-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/50 p-3 text-base text-slate-800 dark:text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/40 rounded-l-lg"
                      />
                    </label>
                  </div>
                ))}

                <button
                  type="submit"
                  className="mt-4 flex items-center justify-center h-12 rounded-lg w-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Đăng ký
                </button>
              </form>

              {message && (
                <p className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
                  {message}
                </p>
              )}

              <div className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bạn đã có tài khoản?{" "}
                  <span
                    onClick={() => navigate('/login')}
                    className="font-medium text-primary hover:underline cursor-pointer"
                  >
                    Đăng nhập
                  </span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
