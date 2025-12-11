import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../component/customer/footer";
import Header from "../../component/customer/header";

export default function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    // State quản lý tab, chế độ edit, user và đơn hàng
    const [tab, setTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [backupUser, setBackupUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        avatar_url: "",
    });

    // Hàm lấy thông tin người dùng hiện tại
    const fetchUser = async () => {
        try {
            const res = await fetch("https://freshmilk.free.nf/api/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                navigate("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Hàm lấy lịch sử mua hàng
    const fetchOrders = async () => {
        try {
            const res = await fetch("https://freshmilk.free.nf/api/orders/history", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.log("Không thể tải lịch sử mua hàng");
                return;
            }

            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Hàm cập nhật thông tin người dùng
    const handleUpdateUser = async () => {
        try {
            const res = await fetch("https://freshmilk.free.nf/api/users/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if (!res.ok) {
                alert("Cập nhật không thành công!");
                return;
            }

            alert("Cập nhật thông tin thành công!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Lỗi hệ thống!");
        }
    };

    // Xử lý hủy bỏ chỉnh sửa: quay về dữ liệu cũ
    const handleCancelEdit = () => {
        setUser(backupUser);
        setIsEditing(false);
    };

    // Xử lý bắt đầu chỉnh sửa: lưu backup dữ liệu
    const handleStartEdit = () => {
        setBackupUser(user);
        setIsEditing(true);
    };

    // Effect: Load user khi mount
    useEffect(() => {
        fetchUser();
    }, [navigate, token]);

    // Effect: Load orders khi chuyển tab
    useEffect(() => {
        if (tab === "orders") fetchOrders();
    }, [tab]);

    return (
        <div className="bg-white dark:bg-background-dark font-display text-text-color">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <Header />

                    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 mt-10">
                        <section className="px-4 md:px-10 lg:px-40 py-5">
                            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                                <aside className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-5 h-max">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={user.avatar_url}
                                            className="w-20 h-20 rounded-full object-cover border shadow"
                                            alt="avatar"
                                        />
                                        <p className="mt-3 font-bold">{user.full_name}</p>
                                        <p className="text-gray-500 text-sm">{user.email}</p>
                                    </div>

                                    <nav className="mt-6 space-y-3">
                                        <button
                                            className={`w-full text-left px-4 py-2 rounded-lg font-medium ${tab === "profile" ? "bg-primary text-white" : "hover:bg-gray-200 dark:hover:bg-gray-800"
                                                }`}
                                            onClick={() => setTab("profile")}
                                        >
                                            Thông tin cá nhân
                                        </button>

                                        <button
                                            className={`w-full text-left px-4 py-2 rounded-lg font-medium ${tab === "orders" ? "bg-primary text-white" : "hover:bg-gray-200 dark:hover:bg-gray-800"
                                                }`}
                                            onClick={() => setTab("orders")}
                                        >
                                            Lịch sử mua hàng
                                        </button>
                                    </nav>
                                </aside>

                                <div className="lg:col-span-3">
                                    {tab === "profile" && (
                                        <div className="bg-white dark:bg-background-dark shadow-md rounded-lg p-6 space-y-6">
                                            <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>

                                            <div>
                                                <label className="font-semibold">Họ và tên</label>
                                                <input
                                                    type="text"
                                                    className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                                    value={user.full_name}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="font-semibold">Email</label>
                                                <input
                                                    type="email"
                                                    className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                                    value={user.email}
                                                    disabled
                                                />
                                            </div>

                                            <div>
                                                <label className="font-semibold">Số điện thoại</label>
                                                <input
                                                    type="text"
                                                    className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                                    value={user.phone || ""}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="font-semibold">Địa chỉ</label>
                                                <input
                                                    type="text"
                                                    className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                                    value={user.address || ""}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                {!isEditing ? (
                                                    <button
                                                        className="mt-4 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
                                                        onClick={handleStartEdit}
                                                    >
                                                        Cập nhật thông tin
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="mt-4 bg-gray-300 text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-400"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            className="mt-4 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
                                                            onClick={handleUpdateUser}
                                                        >
                                                            Lưu
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {tab === "orders" && (
                                        <div className="bg-white dark:bg-background-dark shadow-md rounded-lg p-6">
                                            <h2 className="text-2xl font-bold mb-5">Lịch sử mua hàng</h2>
                                            {orders.length === 0 ? (
                                                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                                            ) : (
                                                <div className="space-y-5">
                                                    {orders.map((order) => (
                                                        <div key={order.order_id} className="border rounded-lg p-4 dark:border-gray-700">
                                                            <p className="font-bold">Mã đơn: #{order.order_id}</p>
                                                            <p>Ngày đặt: {order.order_date}</p>
                                                            <p>Tổng tiền: {Number(order.total_amount).toLocaleString()} VND</p>
                                                            <p>Trạng thái: {order.status}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
}