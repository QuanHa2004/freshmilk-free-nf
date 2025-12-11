import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export default function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // Lấy dữ liệu giỏ hàng từ localStorage nếu có
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Khi token thay đổi → đồng bộ giỏ hàng
  useEffect(() => {
    if (token) {
      fetchCartItems();
      syncLocalCartToBackend(token);
    }
  }, [token]);

  // Cập nhật token khi đăng nhập
  const updateToken = (newToken) => {
    setToken(newToken);
  };

  // Đăng xuất
  const logOut = () => {
    setCartItems([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("cart");
  };

  // Lấy giỏ hàng của người dùng hiện tại
  const fetchCartItems = async () => {
    if (!token) return;

    try {
      const res = await fetch("https://freshmilk.free.nf/api/carts/current_user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Thất bại");

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
      setCartItems([]);
    }
  };

  // Đồng bộ giỏ hàng localStorage lên backend sau khi đăng nhập
  const syncLocalCartToBackend = async (token) => {
    if (!token) return;

    const localCart = localStorage.getItem("cart");
    if (!localCart) return;

    const cartData = JSON.parse(localCart);

    for (const item of cartData) {
      await addToCart(
        {
          product_id: item.product_id,
          price: item.price,
          is_checked: item.is_checked ?? false,
        },
        item.quantity
      );
    }

    localStorage.removeItem("cart");
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product, quantity) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find((i) => i.product_id === product.product_id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          product_id: product.product_id,
          product_name: product.product_name,
          description: product.description,
          image_url: product.image_url,
          price: product.price,
          quantity,
          is_checked: false,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch("https://freshmilk.free.nf/api/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity,
          is_checked: false,
        }),
      });

      if (!res.ok) throw new Error("Không thể thêm sản phẩm");

      await fetchCartItems();
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (product_id) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((item) => item.product_id !== product_id);
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch(`https://freshmilk.free.nf/api/carts/remove/${product_id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể xóa sản phẩm");

      setCartItems((prev) => prev.filter((item) => item.product_id !== product_id));
    } catch (err) {
      console.error(err);
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (product_id, quantity) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find((item) => item.product_id === product_id);

      if (existingItem) existingItem.quantity = quantity;

      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch("https://freshmilk.free.nf/api/carts/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, quantity }),
      });

      if (!res.ok) throw new Error("Không thể cập nhật số lượng sản phẩm");

      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === product_id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Tăng số lượng
  const increase = (product_id) => {
    const item = cartItems.find((p) => p.product_id === product_id);
    if (item) updateQuantity(product_id, item.quantity + 1);
  };

  // Giảm số lượng
  const decrease = (product_id) => {
    const item = cartItems.find((p) => p.product_id === product_id);
    if (item && item.quantity > 1) updateQuantity(product_id, item.quantity - 1);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        logOut,
        updateToken,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increase,
        decrease,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
