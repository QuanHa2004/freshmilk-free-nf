import useCart from "../../context/cart-context";

export default function CartSummary({ showPaymentSection = false }) {
  const { cartItems } = useCart();

  // Lọc ra các sản phẩm được chọn để thanh toán
  const selectedItems = cartItems.filter(item => item.is_checked);

  // Tính tổng tiền hàng
  const total_amount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Thuế VAT 8%
  const taxRate = 0.08;
  const taxes = total_amount * taxRate;

  // Tổng cộng = tiền hàng + thuế
  const total = total_amount + taxes;

  return (
    <div className="space-y-4 mt-4">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào!</p>
        ) : (
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            {selectedItems.map((item) => (
              <li key={item.product_id} className="flex justify-between py-1 items-start">
                <div className="flex-1 min-w-[0] flex flex-col">
                  <span className="font-medium break-words">{item.product_name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Số lượng: {item.quantity}
                  </span>
                </div>

                <span className="font-medium ml-4 flex-shrink-0 whitespace-nowrap">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between text-gray-600 dark:text-gray-300">
        <span>Tổng tiền ước tính</span>
        <span>{total_amount.toLocaleString('vi-VN')} VND</span>
      </div>

      <div className="flex justify-between text-gray-600 dark:text-gray-300">
        <span>Thuế</span>
        <span>{taxes.toLocaleString('vi-VN')} VND</span>
      </div>

      {showPaymentSection && selectedItems.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
            <span>Voucher áp dụng</span>
            <span className="text-gray-500 dark:text-gray-400">Chưa áp dụng</span>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

      <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString('vi-VN')} VND</span>
      </div>
    </div>
  );
}
