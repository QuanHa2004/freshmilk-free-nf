import SideBar from "../../component/admin/side-bar";
import { useNavigate } from "react-router-dom";
import CategoryList from "../../component/admin/category-list";

export default function CategoryManagement() {
  // Điều hướng sang trang khác
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="ml-64 flex flex-row min-h-screen">

          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-7xl mx-auto">

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
                    Quản lý danh mục
                  </p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Tổ chức và phân loại sản phẩm của cửa hàng.
                  </p>
                </div>

                {/* Điều hướng sang trang thêm danh mục */}
                <button
                  onClick={() => navigate('/admin/add-category')}
                  className="flex items-center justify-center gap-2 rounded-xl h-10 px-5 bg-amber-900 text-white text-sm font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Thêm danh mục</span>
                </button>
              </div>

              <div className="flex flex-wrap items-end gap-4 mb-6">
                <label className="flex flex-col min-w-40 h-12 w-full max-w-lg">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 overflow-hidden">

                    <div className="text-stone-400 flex items-center justify-center pl-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>

                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-700 dark:text-stone-200 focus:outline-0 border-none bg-transparent h-full placeholder:text-stone-400 px-3 text-base font-normal leading-normal"
                      placeholder="Tìm kiếm danh mục..."
                    />
                  </div>
                </label>
              </div>

              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                <CategoryList />
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
