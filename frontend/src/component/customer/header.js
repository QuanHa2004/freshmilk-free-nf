import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useCart from "../../context/cart-context";

export default function Header() {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const { cartItems, logOut, updateToken } = useCart();

  // Tổng số lượng sản phẩm trong giỏ
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Lấy thông tin người dùng khi load trang
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

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = () => {
    fetch(`https://freshmilk.free.nf/api/products/search/${searchName}`)
      .then((res) => res.json())
      .then((data) => {
        navigate("/products", { state: { result: data } });
      })
      .catch((err) => console.error("Không tìm thấy", err));
  };

  // Xử lý đăng xuất
  const handleLogOut = () => {
    updateToken(null);
    logOut();
    setCurrentUser("Đăng nhập");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white px-4 md:px-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-primary/30 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-secondary">
          <div className="size-8">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tight text-stone-800 dark:text-stone-100">
            <span className="text-amber-800 dark:text-amber-600">Fresh Milk</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-9">
          <button
            className="text-text-color text-base font-medium leading-normal hover:text-primary"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </button>

          <button
            className="text-text-color text-base font-medium leading-normal hover:text-primary"
            onClick={() => navigate("/products")}
          >
            Sản phẩm
          </button>

          <label className="flex flex-col min-w-40 !h-10 max-w-sm w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div
                onClick={handleSearch}
                className="text-text-secondary dark:text-gray-400 flex border-none bg-gray-100 dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0"
              >
                <span className="material-symbols-outlined">search</span>
              </div>

              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-none bg-gray-100 dark:bg-gray-800 h-full placeholder:text-text-secondary dark:placeholder-gray-400 px-4 text-base font-normal leading-normal"
                placeholder="Tìm kiếm sản phẩm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
          </label>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          {currentUser?.full_name ? (
            <details className="relative group">
              <summary className="flex items-center gap-2 bg-primary/20 text-secondary px-3 py-2 rounded-full hover:bg-primary/30 transition-colors list-none cursor-pointer">
                <span className="material-symbols-outlined text-2xl">person</span>
                <p className="font-medium">{currentUser.full_name}</p>
              </summary>

              <div className="flex flex-col absolute right-0 mt-2 w-28 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg py-2 z-50">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Hồ sơ
                </button>
                
                <button
                  onClick={handleLogOut}
                  className="w-full text-left px-4 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Đăng xuất
                </button>
              </div>
            </details>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-primary/20 text-secondary px-3 py-2 rounded-full hover:bg-primary/30 transition-colors"
            >
              <span className="material-symbols-outlined">person</span>
              <p>Đăng nhập</p>
            </button>
          )}
        </div>

        <button
          className="relative flex items-center justify-center rounded-full h-10 w-10 bg-primary/20 text-secondary hover:bg-primary/30 transition-colors"
          onClick={() => navigate("/carts")}
        >
          <span className="material-symbols-outlined">shopping_cart</span>

          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
