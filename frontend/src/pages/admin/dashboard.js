import SideBar from "../../component/admin/side-bar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Lưu dữ liệu báo cáo tổng quan
  const [report, setReport] = useState({
    total_revenue: 0,
    total_orders: 0,
    new_customer: 0,
    avg_value: 0
  });

  useEffect(() => {
    fetch("https://freshmilk.free.nf/api/admin/reports")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917]">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0">
        <SideBar />
      </div>

      <main className="flex-1 p-8 w-full overflow-hidden">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">

          <div className="flex min-w-72 flex-col gap-1">
            <p className="text-stone-800 dark:text-stone-100 text-3xl font-black tracking-tight">
              Bảng điều khiển
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Tổng quan tình hình kinh doanh tháng này.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Tổng doanh thu
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.total_revenue).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Tổng đơn hàng
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.total_orders).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Khách hàng mới
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.new_customer).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

            <div className="group relative flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-1">
                  Giá trị trung bình/đơn
                </p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {Number(report.avg_value).toLocaleString('vi-VN')}
                </h3>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
