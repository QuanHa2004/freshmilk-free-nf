import { useEffect, useState } from "react";

export default function OrderList() {
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://freshmilk.free.nf/api/admin/orders");

                if (!res.ok) {
                    throw new Error("Lỗi kết nối server");
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setOrderList(data);
                } else {
                    setOrderList([]);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setOrderList([]);
            }
        };

        fetchData();
    }, []);

    // Trả về cấu hình hiển thị theo trạng thái đơn hàng
    const getStatusConfig = (status) => {
        switch (status) {
            case "pending":
                return { label: "Chờ xác nhận", style: "bg-amber-100 text-amber-800 border-amber-200" };
            case "processing":
                return { label: "Đang đóng gói", style: "bg-blue-100 text-blue-800 border-blue-200" };
            case "shipping":
                return { label: "Đang giao hàng", style: "bg-purple-100 text-purple-800 border-purple-200" };
            case "delivered":
                return { label: "Giao thành công", style: "bg-emerald-100 text-emerald-800 border-emerald-200" };
            case "cancelled":
                return { label: "Đã hủy", style: "bg-stone-100 text-stone-500 border-stone-200" };
            default:
                return { label: "Không rõ", style: "bg-gray-100 text-gray-600 border-gray-200" };
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1C1917] shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#F5F2EB] dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Mã đơn hàng</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Tên khách hàng</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Ngày đặt</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Tổng tiền</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {orderList.length > 0 ? (
                            orderList.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);

                                return (
                                    <tr
                                        key={index}
                                        className="group hover:bg-[#FAF9F6] dark:hover:bg-stone-800/30 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50">
                                                #{order.order_id}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                                                {order.full_name}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400">
                                            {new Date(order.order_date).toLocaleDateString('vi-VN')}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                                {Number(order.total_amount).toLocaleString('vi-VN')}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusConfig.style}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                                                {statusConfig.label}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline transition-colors">
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-stone-400">
                                        <p className="text-sm font-medium">Không có đơn hàng nào.</p>
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
