import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddCategory() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("https://freshmilk.free.nf/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: categoryName }),
      });

      if (res.ok) {
        navigate("/admin/category");
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="ml-64 flex flex-row min-h-screen">
          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex flex-col gap-1 mb-8">
                <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
                  Thêm danh mục
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  Tạo danh mục mới để phân loại sản phẩm.
                </p>
              </div>

              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </span>
                      Thông tin chung
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                      <label className="flex flex-col w-full gap-2">
                        <span className="text-stone-700 dark:text-stone-300 text-sm font-semibold">
                          Tên danh mục <span className="text-red-500">*</span>
                        </span>
                        <input
                          type="text"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#1C1917] text-stone-800 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                          placeholder="Ví dụ: Sữa tươi, Sữa chua..."
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-stone-100 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="h-11 px-6 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-8 rounded-xl bg-amber-900 text-white font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 transition-all duration-300 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang lưu...
                        </>
                      ) : (
                        "Lưu danh mục"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
