import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useCart from '../../context/cart-context';

export default function BestSellingProduct() {
  const [productList, setProductList] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm từ backend khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://freshmilk.free.nf/api/products");

        if (!res.ok) {
          throw new Error("Lỗi kết nối server");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setProductList(data);
        } else {
          setProductList([]);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setProductList([]);
      }
    };

    fetchData();
  }, []);

  // Điều hướng sang trang chi tiết sản phẩm khi click
  const handleClick = (product) => {
    navigate(`product-details/${product.product_id}`);
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAdd = async (product, e) => {
    e.stopPropagation();
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {productList
        .filter(product => product.is_hot === 1 && product.quantity > 0)
        .slice(0, 3)
        .map((product) => (
          <div
            key={product.product_id}
            onClick={() => handleClick(product)}
            className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div
              className="w-full h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('${product.image_url}')` }}
            ></div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-text-color text-xl font-bold">
                {product.product_name}
              </h3>

              <p className="text-gray-500 mt-1 flex-1">
                {product.description}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Số lượng còn: {product.quantity}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-secondary">
                  {Number(product.price).toLocaleString('vi-VN')} VND
                </span>

                <button
                  onClick={(e) => handleAdd(product, e)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">
                    add_shopping_cart
                  </span>
                  Thêm
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
