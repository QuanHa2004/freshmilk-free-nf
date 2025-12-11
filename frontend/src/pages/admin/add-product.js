import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // State lưu trữ dữ liệu form
  const [productData, setProductData] = useState({
    product_name: "", category_id: "", price: "", quantity: "",
    discount_percent: 0, image_url: "", description: "", is_hot: 0
  });

  const [detailData, setDetailData] = useState({
    origin: "", ingredients: "", usage: "", storage: "", other_nutrients: ""
  });

  const [macros, setMacros] = useState({
    calories: 0, protein: 0, fat: 0, carbohydrates: 0, sugar: 0
  });

  const [vitamins, setVitamins] = useState([{ name: "", value: "" }]);
  const [minerals, setMinerals] = useState([{ name: "", value: "" }]);

  // Styles chung cho input và label
  const inputClass = "w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 text-sm";
  const labelClass = "text-stone-700 dark:text-stone-300 text-sm font-semibold mb-1.5 block";

  // Lấy danh sách danh mục từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://freshmilk.free.nf/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0) {
            setProductData(prev => ({ ...prev, category_id: data[0].category_id }));
          }
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Các hàm xử lý thay đổi giá trị input cơ bản
  const handleProductChange = (e) => setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDetailChange = (e) => setDetailData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleMacroChange = (e) => setMacros(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Xử lý thay đổi giá trị trong danh sách động (Vitamin/Khoáng chất)
  const handleDynamicChange = (index, type, field, value) => {
    const setter = type === 'vitamin' ? setVitamins : setMinerals;
    const data = type === 'vitamin' ? [...vitamins] : [...minerals];
    data[index][field] = value;
    setter(data);
  };

  // Thêm dòng mới cho danh sách động
  const addRow = (type) => {
    const setter = type === 'vitamin' ? setVitamins : setMinerals;
    setter(prev => [...prev, { name: "", value: "" }]);
  };

  // Xóa dòng khỏi danh sách động
  const removeRow = (index, type) => {
    const setter = type === 'vitamin' ? setVitamins : setMinerals;
    const data = type === 'vitamin' ? [...vitamins] : [...minerals];
    if (data.length > 1) {
      data.splice(index, 1);
      setter(data);
    }
  };

  // Xử lý logic submit form và gửi dữ liệu lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Chuyển mảng object [{name, value}] thành object {name: value}
      const formatToObj = (arr) => {
        const obj = {};
        arr.forEach(item => {
          if (item.name && item.value) obj[item.name] = item.value;
        });
        return obj;
      };

      const payload = {
        ...productData,
        ...detailData,
        ...macros,
        vitamins: formatToObj(vitamins),
        minerals: formatToObj(minerals)
      };

      const res = await fetch("https://freshmilk.free.nf/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Thêm sản phẩm thành công!");
        navigate("/admin/product");
      } else {
        const err = await res.json();
        alert("Lỗi: " + (err.error || "Không xác định"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Lỗi kết nối server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="ml-64 w-full">
        <div className="fixed inset-y-0 left-0 z-50 w-64">
          <SideBar />
        </div>

        <main className="p-8 w-full max-w-6xl mx-auto">
          <div className="flex flex-col gap-1 mb-8">
            <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">Thêm sản phẩm mới</p>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Nhập thông tin chi tiết đầy đủ cho sản phẩm sữa.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
              <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                </span>
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <label className="lg:col-span-2">
                  <span className={labelClass}>Tên sản phẩm <span className="text-red-500">*</span></span>
                  <input name="product_name" value={productData.product_name} onChange={handleProductChange} required className={inputClass} placeholder="Ví dụ: Sữa Tươi Vinamilk 100% Đường Đen" />
                </label>

                <label>
                  <span className={labelClass}>Danh mục <span className="text-red-500">*</span></span>
                  <select name="category_id" value={productData.category_id} onChange={handleProductChange} className={inputClass} required>
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                      ))
                    ) : (<option disabled>Đang tải...</option>)}
                  </select>
                </label>

                <label>
                  <span className={labelClass}>Giá bán (VNĐ) <span className="text-red-500">*</span></span>
                  <input type="number" name="price" value={productData.price} onChange={handleProductChange} required className={inputClass} placeholder="VD: 35000" />
                </label>

                <label>
                  <span className={labelClass}>Số lượng kho <span className="text-red-500">*</span></span>
                  <input type="number" name="quantity" value={productData.quantity} onChange={handleProductChange} required className={inputClass} placeholder="VD: 100" />
                </label>

                <label>
                  <span className={labelClass}>Giảm giá (%)</span>
                  <input type="number" name="discount_percent" value={productData.discount_percent} onChange={handleProductChange} className={inputClass} placeholder="VD: 10" />
                </label>

                <label className="lg:col-span-3">
                  <span className={labelClass}>Link hình ảnh</span>
                  <input name="image_url" value={productData.image_url} onChange={handleProductChange} className={inputClass} placeholder="https://example.com/hinh-anh-san-pham.jpg" />
                </label>

                <label className="lg:col-span-3">
                  <span className={labelClass}>Mô tả ngắn</span>
                  <textarea name="description" value={productData.description} onChange={handleProductChange} className={`${inputClass} h-24 py-2 resize-none`} placeholder="Nhập mô tả ngắn gọn về sản phẩm, điểm nổi bật..." />
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6">
              <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                  <span className="material-symbols-outlined text-lg">article</span>
                </span>
                Chi tiết & Hướng dẫn
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <label>
                  <span className={labelClass}>Xuất xứ</span>
                  <input name="origin" value={detailData.origin} onChange={handleDetailChange} className={inputClass} placeholder="VD: Việt Nam, Úc, Mỹ..." />
                </label>
                <label>
                  <span className={labelClass}>Thành phần nguyên liệu</span>
                  <input name="ingredients" value={detailData.ingredients} onChange={handleDetailChange} className={inputClass} placeholder="VD: Sữa bò tươi, Đường tinh luyện, Vitamin..." />
                </label>
                <label>
                  <span className={labelClass}>Hướng dẫn sử dụng</span>
                  <input name="usage" value={detailData.usage} onChange={handleDetailChange} className={inputClass} placeholder="VD: Lắc đều trước khi uống, ngon hơn khi uống lạnh" />
                </label>
                <label>
                  <span className={labelClass}>Hướng dẫn bảo quản</span>
                  <input name="storage" value={detailData.storage} onChange={handleDetailChange} className={inputClass} placeholder="VD: Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp" />
                </label>
                <label className="lg:col-span-2">
                  <span className={labelClass}>Chất bổ sung khác (DHA, Omega...)</span>
                  <input name="other_nutrients" value={detailData.other_nutrients} onChange={handleDetailChange} className={inputClass} placeholder="VD: Bổ sung DHA giúp phát triển trí não..." />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6 h-full">
                <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                    <span className="material-symbols-outlined text-lg">donut_small</span>
                  </span>
                  Dinh dưỡng chính (trên 100g/ml)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <label>
                    <span className={labelClass}>Năng lượng (Kcal)</span>
                    <input type="number" step="0.1" name="calories" value={macros.calories} onChange={handleMacroChange} className={inputClass} placeholder="VD: 70.5" />
                  </label>
                  <label>
                    <span className={labelClass}>Chất đạm (g)</span>
                    <input type="number" step="0.1" name="protein" value={macros.protein} onChange={handleMacroChange} className={inputClass} placeholder="VD: 3.2" />
                  </label>
                  <label>
                    <span className={labelClass}>Chất béo (g)</span>
                    <input type="number" step="0.1" name="fat" value={macros.fat} onChange={handleMacroChange} className={inputClass} placeholder="VD: 3.5" />
                  </label>
                  <label>
                    <span className={labelClass}>Carbs (g)</span>
                    <input type="number" step="0.1" name="carbohydrates" value={macros.carbohydrates} onChange={handleMacroChange} className={inputClass} placeholder="VD: 4.8" />
                  </label>
                  <label>
                    <span className={labelClass}>Đường (g)</span>
                    <input type="number" step="0.1" name="sugar" value={macros.sugar} onChange={handleMacroChange} className={inputClass} placeholder="VD: 4.0" />
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-6 h-full">
                <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                    <span className="material-symbols-outlined text-lg">medication</span>
                  </span>
                  Vitamin & Khoáng chất
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-stone-500">Vitamins</span>
                    <button type="button" onClick={() => addRow('vitamin')} className="text-xs text-blue-600 hover:underline font-bold">+ Thêm dòng</button>
                  </div>
                  {vitamins.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input placeholder="Tên (VD: Vitamin A)" value={item.name} onChange={(e) => handleDynamicChange(index, 'vitamin', 'name', e.target.value)} className={`${inputClass} !h-9 !text-xs`} />
                      <input placeholder="Lượng (VD: 200IU)" value={item.value} onChange={(e) => handleDynamicChange(index, 'vitamin', 'value', e.target.value)} className={`${inputClass} !h-9 !text-xs`} />
                      {vitamins.length > 1 && <button type="button" onClick={() => removeRow(index, 'vitamin')} className="text-red-500 hover:text-red-700 px-2 font-bold">✕</button>}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-stone-500">Khoáng chất</span>
                    <button type="button" onClick={() => addRow('mineral')} className="text-xs text-blue-600 hover:underline font-bold">+ Thêm dòng</button>
                  </div>
                  {minerals.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input placeholder="Tên (VD: Canxi)" value={item.name} onChange={(e) => handleDynamicChange(index, 'mineral', 'name', e.target.value)} className={`${inputClass} !h-9 !text-xs`} />
                      <input placeholder="Lượng (VD: 100mg)" value={item.value} onChange={(e) => handleDynamicChange(index, 'mineral', 'value', e.target.value)} className={`${inputClass} !h-9 !text-xs`} />
                      {minerals.length > 1 && <button type="button" onClick={() => removeRow(index, 'mineral')} className="text-red-500 hover:text-red-700 px-2 font-bold">✕</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-stone-200 dark:border-stone-700">
              <button type="button" onClick={() => navigate(-1)} className="h-11 px-6 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors dark:text-stone-300 dark:hover:bg-stone-800 dark:border-stone-600">
                Hủy bỏ
              </button>
              <button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-amber-900 text-white font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800">
                {isSubmitting ? "Đang lưu..." : "Xác nhận thêm"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}