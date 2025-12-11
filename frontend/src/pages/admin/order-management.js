import OrderList from "../../component/admin/order-list";
import SideBar from "../../component/admin/side-bar";

export default function OrderManagement() {
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
                    Quản lý đơn hàng
                  </p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Theo dõi và xử lý các đơn hàng mới nhất.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-4 mb-6">
                <label className="flex flex-col min-w-40 h-12 w-full max-w-lg">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 overflow-hidden">
                    
                    <div className="text-stone-400 flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    
                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-stone-700 dark:text-stone-200 focus:outline-0 border-none bg-transparent h-full placeholder:text-stone-400 px-3 text-base font-normal leading-normal"
                      placeholder="Tìm theo mã đơn, tên khách hàng..."
                    />
                  </div>
                </label>
              </div>

              <div className="bg-white dark:bg-[#292524] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                <OrderList />
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
