import { useEffect, useState } from "react";

export default function ProductList() {
    const [productList, setProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://freshmilk.free.nf/api/admin/products");

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1917] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[30%]">
                                Tên sản phẩm
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%]">
                                Giá
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[10%]">
                                Kho
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%]">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%]">
                                Hot
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-[15%] text-right">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : productList.length > 0 ? (
                            productList.map((product, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="font-semibold text-stone-700 dark:text-stone-200 whitespace-normal break-words"
                                                title={product.product_name}
                                            >
                                                {product.product_name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                            {Number(product.price).toLocaleString("vi-VN")}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`text-sm font-medium ${product.quantity > 0
                                                    ? "text-stone-600 dark:text-stone-400"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {product.quantity}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {product.is_deleted ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-stone-100 text-stone-500 border-stone-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                                                Đã ẩn
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                                                Hiển thị
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {product.is_hot ? (
                                            <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit border border-orange-100">
                                                <span>HOT</span>
                                            </div>
                                        ) : (
                                            <span className="text-stone-300 text-xl leading-none"></span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline transition-colors">
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-stone-400">
                                        <p className="text-sm font-medium">Chưa có sản phẩm nào.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
