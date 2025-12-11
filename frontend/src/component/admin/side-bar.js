import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useCart from "../../context/cart-context";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});
  const { logOut, updateToken } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      fetch("https://freshmilk.free.nf/api/current_user", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error("Lỗi:", err));
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogOut = () => {
    updateToken(null);
    logOut();
    setCurrentUser("Đăng nhập");
    navigate("/login", { replace: true });
  };

  const icons = {
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    order: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
    category: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    product: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    logout: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    ),
    store: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  };

  // Danh sách các mục trong sidebar
  const navItems = [
    { icon: icons.dashboard, text: "Bảng điều khiển", url: "/admin/dashboard" },
    { icon: icons.order, text: "Đơn hàng", url: "/admin/order" },
    { icon: icons.category, text: "Danh mục", url: "/admin/category" },
    { icon: icons.product, text: "Sản phẩm", url: "/admin/product" },
  ];

  // Kiểm tra mục nào đang active dựa trên URL
  const isActive = (url) => {
    if (url === "/admin/dashboard" && location.pathname === "/admin/dashboard") return true;
    return location.pathname.startsWith(url) && url !== "/admin/dashboard";
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#EFECE5] dark:bg-[#151413] border-r border-stone-300 dark:border-stone-800 flex flex-col z-50 shadow-sm">

      <div className="h-20 flex items-center px-6 border-b border-stone-300 dark:border-stone-800">
        <div className="flex items-center gap-3 text-amber-900 dark:text-amber-500">
          <div className="p-2 bg-amber-200/50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-500 rounded-xl">
            {icons.store}
          </div>
          <h1 className="text-xl font-black tracking-tight text-stone-800 dark:text-stone-100">
            Fresh<span className="text-amber-800 dark:text-amber-600">Milk</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">

        {navItems.map((item) => {
          const active = isActive(item.url);
          return (
            <button
              key={item.text}
              onClick={() => navigate(item.url)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                ${active
                  ? "bg-amber-900 text-white shadow-lg shadow-amber-900/20"
                  : "text-stone-600 dark:text-stone-400 hover:bg-white/60 dark:hover:bg-stone-800 hover:text-amber-900 dark:hover:text-amber-400 hover:shadow-sm"
                }
              `}
            >
              <span className={`transition-transform duration-200 ${active ? "text-amber-100" : "text-stone-500 group-hover:text-amber-800 group-hover:scale-110"}`}>
                {item.icon}
              </span>

              <span>{item.text}</span>

              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-100/30 rounded-l-full"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-stone-300 dark:border-stone-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-stone-300 dark:bg-stone-800 dark:border-stone-700 hover:bg-white hover:border-amber-300 transition-all cursor-pointer shadow-sm">

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-800 to-amber-600 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white/50 dark:border-stone-700">
            A
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">
              {currentUser.full_name}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 truncate">
              {currentUser.email}
            </p>
          </div>

          <button
            onClick={handleLogOut}
            className="text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors p-1.5 rounded-lg"
            title="Đăng xuất"
          >
            {icons.logout}
          </button>
        </div>
      </div>

    </aside>
  );
}