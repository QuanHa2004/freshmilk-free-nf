import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import useCart from '../../context/cart-context';

export default function ProductDetail() {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`https://freshmilk.free.nf/api/products/${product_id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
            });
    }, [product_id]);

    const handleAdd = async (e) => {
        e.stopPropagation();
        try {
            await addToCart(product, quantity);
        } catch (err) {
            console.error(err);
        }
    };

    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

    if (!product) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-background-dark font-display text-text-color">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <Header />
                    <section className="px-4 md:px-10 lg:px-40 py-5">
                        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5 mt-10">
                            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">

                                <div className="flex flex-col lg:flex-row gap-8 mt-6">
                                    <div className="w-full lg:w-1/2">
                                        <div
                                            className="bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white rounded-xl min-h-80 shadow-lg"
                                            data-alt="Product Image"
                                            style={{ backgroundImage: `url(${product.image_url})` }}
                                        ></div>
                                    </div>

                                    <div className="w-full lg:w-1/2 flex flex-col">
                                        <h1 className="text-[#333333] dark:text-white tracking-light text-[32px] font-bold leading-tight">
                                            {product.product_name}
                                        </h1>

                                        <p className="text-[#333333] dark:text-gray-300 text-base font-normal leading-normal py-3">
                                            {product.description}
                                        </p>

                                        <h2 className="text-[#333333] dark:text-white tracking-light text-[28px] font-bold leading-tight pt-2">
                                            {Number(product.price).toLocaleString("vi-VN")} VND / thùng
                                        </h2>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            Số lượng còn: <span className="font-semibold">{product.quantity} thùng</span>
                                        </p>

                                        <div className="flex items-center gap-4 mt-6">
                                            <label className="text-[#333333] dark:text-gray-300" htmlFor="quantity">
                                                Quantity:
                                            </label>

                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                                <button
                                                    onClick={() => decrease()}
                                                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                                                >
                                                    <span className="material-symbols-outlined text-base">remove</span>
                                                </button>

                                                <input
                                                    id="quantity"
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                                    }
                                                    className="w-12 text-center border-0 bg-transparent text-[#333333] dark:text-white focus:ring-0"
                                                />

                                                <button
                                                    onClick={() => increase()}
                                                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                                                >
                                                    <span className="material-symbols-outlined text-base">add</span>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => handleAdd(e)}
                                            className="bg-primary text-white font-semibold py-3 px-6 rounded-lg mt-6 w-full lg:w-auto hover:bg-primary/90 transition-colors duration-300 shadow-md"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <h3 className="text-[#333333] dark:text-white text-xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-6">
                                        Thông tin chi tiết
                                    </h3>

                                    <div className="text-[#333333] dark:text-gray-300 space-y-8">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-1">
                                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Xuất xứ
                                                        </span>
                                                        <p className="font-medium text-lg text-[#333333] dark:text-white">
                                                            {product.origin || "Việt Nam"}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Thành phần
                                                        </span>
                                                        <p className="font-medium text-[#333333] dark:text-white text-justify">
                                                            {product.ingredients || "100% Sữa tươi nguyên chất"}
                                                        </p>
                                                        {product.other_nutrients && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <span className="font-semibold">Bổ sung:</span> {product.other_nutrients}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-1">
                                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Hướng dẫn sử dụng
                                                        </span>
                                                        <p className="text-[#333333] dark:text-white">
                                                            {product.usage || "Dùng trực tiếp, ngon hơn khi uống lạnh."}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Bảo quản
                                                        </span>
                                                        <p className="text-[#333333] dark:text-white">
                                                            {product.storage || "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[#333333] dark:text-white text-lg font-bold mb-4">
                                                Giá trị dinh dưỡng (trên 100g/ml)
                                            </h4>

                                            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">

                                                    <div>
                                                        <table className="w-full text-left border-collapse">
                                                            <thead className="bg-gray-100 dark:bg-gray-900/50">
                                                                <tr>
                                                                    <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Chỉ số chính</th>
                                                                    <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Hàm lượng</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                                <tr>
                                                                    <td className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Năng lượng</td>
                                                                    <td className="p-3 text-sm font-bold text-[#333333] dark:text-white text-right">{product.calories || 0} kcal</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Protein (Đạm)</td>
                                                                    <td className="p-3 text-sm font-bold text-[#333333] dark:text-white text-right">{product.protein || 0} g</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Total Fat (Béo)</td>
                                                                    <td className="p-3 text-sm font-bold text-[#333333] dark:text-white text-right">{product.fat || 0} g</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Carbohydrate</td>
                                                                    <td className="p-3 text-sm font-bold text-[#333333] dark:text-white text-right">{product.carbohydrates || 0} g</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">Đường</td>
                                                                    <td className="p-3 text-sm font-bold text-[#333333] dark:text-white text-right">{product.sugar || 0} g</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div>
                                                        <table className="w-full text-left border-collapse">
                                                            <thead className="bg-gray-100 dark:bg-gray-900/50">
                                                                <tr>
                                                                    <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">Vitamin & Khoáng chất</th>
                                                                    <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Đáp ứng</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                                {(() => {
                                                                    try {
                                                                        const vitamins = product.vitamins ? JSON.parse(product.vitamins) : {};
                                                                        const minerals = product.minerals ? JSON.parse(product.minerals) : {};
                                                                        const micros = { ...vitamins, ...minerals };

                                                                        if (Object.keys(micros).length === 0) {
                                                                            return (
                                                                                <tr>
                                                                                    <td colSpan="2" className="p-3 text-sm text-gray-400 italic text-center">
                                                                                        Thông tin đang cập nhật
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }

                                                                        return Object.entries(micros).map(([key, value], index) => (
                                                                            <tr key={index}>
                                                                                <td className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">{key}</td>
                                                                                <td className="p-3 text-sm font-bold text-[#333333] dark:text-white text-right">{value}</td>
                                                                            </tr>
                                                                        ));
                                                                    } catch (e) {
                                                                        return <tr><td colSpan="2"></td></tr>;
                                                                    }
                                                                })()}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                    <Footer />
                </div>
            </div>
        </div>
    )
}