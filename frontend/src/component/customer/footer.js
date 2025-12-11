export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="px-4 md:px-10 lg:px-40 py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-2">FreshMilk</h3>
            <p className="text-white text-sm">Giao hàng cấp tốc.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-2">Thông báo</h3>
            <ul>
              <li>
                <span className="text-sm text-white hover:text-primary" href="/terms">
                  Điều khoản
                </span>
              </li>
              <li>
                <span className="text-sm text-white hover:text-primary" href="/privacy">
                  Chính sách
                </span>
              </li>
              <li>
                <span className="text-sm text-white hover:text-primary" href="/contact">
                  Liên lạc với chúng tôi
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-2">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white">
          <p>© 2024 FreshMilk. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

