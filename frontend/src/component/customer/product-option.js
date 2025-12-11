import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useCart from "../../context/cart-context";

export default function ProductOption() {
  const { category_id } = useParams();
  const [categoriesList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Lấy dữ liệu tìm kiếm từ trang trước (nếu có)
  const location = useLocation();
  const searchResult = location.state?.result || null;
  console.log(searchResult);

  // Lấy danh sách danh mục khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://freshmilk.free.nf/api/categories");

        if (!res.ok) {
          throw new Error("Lỗi kết nối server");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategoryList(data);
        } else {
          setCategoryList([]);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setCategoryList([]);
      }
    };

    fetchData();
  }, []);

  // Lấy danh sách sản phẩm theo danh mục hoặc theo kết quả tìm kiếm
  useEffect(() => {
    if (searchResult) {
      setProducts(searchResult);
    } else {
      const url = category_id
        ? `https://freshmilk.free.nf/api/${category_id}/products`
        : `https://freshmilk.free.nf/api/products`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Không có sản phẩm", err));
    }
  }, [category_id, searchResult]);

  // Điều hướng sang trang chi tiết sản phẩm
  const handleClick = (product) => {
    navigate(`/product-details/${product.product_id}`);
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAdd = async (e, product) => {
    e.stopPropagation();
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Chọn danh mục để lọc sản phẩm
  const clickCategory = (category_id) => {
    navigate(`/categories/${category_id}/products`);
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#8b4513" }}
        className="fixed top-16 left-0 w-full z-40 px-4 md:px-10 lg:px-40 flex items-center justify-center whitespace-nowrap border-b border-solid border-b-primary/30 py-2 shadow-sm"
      >
        <nav className="flex items-center gap-6 justify-center w-full max-w-4xl">
          <button
            onClick={() => navigate("/products")}
            className="text-white text-base font-bold px-3 py-1 text-center hover:opacity-90"
          >
            Tất cả
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => clickCategory(cat.category_id)}
              className="text-white text-base font-bold px-3 py-1 text-center hover:opacity-90"
            >
              {cat.category_name}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-4 pb-10">
        {products.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter(product => product.quantity > 0)
              .map((product) => (
                <li key={product.product_id}>
                  <div
                    onClick={() => handleClick(product)}
                    className="flex flex-col bg-white dark:bg-background-dark/50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full cursor-pointer"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover"
                      style={{ backgroundImage: `url("${product.image_url}")` }}
                    ></div>

                    <div className="flex flex-col flex-grow justify-between p-4">
                      <div>
                        <p className="text-lg font-bold text-[#111618] dark:text-white line-clamp-2">
                          {product.product_name}
                        </p>

                        <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                          {Number(product.price).toLocaleString("vi-VN")} VND
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Số lượng còn: {product.quantity}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleAdd(e, product)}
                        className="mt-4 w-full flex items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-bold tracking-wide transition-colors duration-300 hover:bg-primary/90 group-hover:bg-primary"
                      >
                        <span className="material-symbols-outlined mr-2">
                          add_shopping_cart
                        </span>
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-center text-white">Chưa có sản phẩm</p>
        )}
      </div>
    </>
  );
}
