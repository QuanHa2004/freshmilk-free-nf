import { useEffect, useState } from "react";

export default function CategoryList() {
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://freshmilk.free.nf/api/admin/categories");

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
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-1/2">
                                Tên danh mục
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-1/4">
                                Số lượng sản phẩm
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider w-1/4 text-right">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-stone-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : categoryList.length > 0 ? (
                            categoryList.map((category, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-stone-700 dark:text-stone-200">
                                                {category.category_name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${category.quantity > 0 ? 'text-stone-600 dark:text-stone-400' : 'text-red-500'}`}>
                                            {category.quantity}
                                        </span>
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
                                <td colSpan="3" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-stone-400">
                                        <p className="text-sm font-medium">Chưa có danh mục nào.</p>
                                        <p className="text-xs mt-1 text-stone-400">Hãy thêm danh mục mới để bắt đầu bán hàng.</p>
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
