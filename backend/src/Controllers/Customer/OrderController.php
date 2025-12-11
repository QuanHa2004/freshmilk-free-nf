<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Controllers\Customer\PaymentController;
use Database\Connection;
use Models\Cart;
use Models\Order;
use Models\Product;

class OrderController
{
    private $user_id;

    // 1. Xác thực người dùng qua Token (JWT) để lấy user_id
    private function authenticate()
    {
        $auth = new AuthController();
        try {
            $payload = $auth->decodeToken();
            $this->user_id = $payload->sub;
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 401);
        }
    }

    // 2. Xử lý đặt hàng: Tạo đơn, trừ tồn kho và điều hướng thanh toán (COD/VNPAY)
    public function checkout($data)
    {
        $this->authenticate();

        if (empty($data['delivery_address']) || empty($data['payment_method']) || empty($data['full_name']) || empty($data['phone'])) {
            Response::json(['error' => 'Vui lòng cung cấp đầy đủ số điện thoại, địa chỉ'], 400);
        }

        $cart = Cart::getCartByUserId($this->user_id);
        if (!$cart) Response::json(['error' => 'Giỏ hàng trống'], 400);

        $cart_items = Cart::getCartItems($cart['cart_id']);
        $items_to_buy = array_filter($cart_items, fn($item) => $item['is_checked'] == 1);

        if (empty($items_to_buy)) {
            Response::json(['error' => 'Vui lòng chọn sản phẩm để thanh toán'], 400);
        }

        $shipping_fee = $data['shipping_fee'] ?? 0;
        $subtotal = array_reduce($items_to_buy, fn($sum, $item) => $sum + $item['price'] * $item['quantity'], 0);
        $total_amount = $subtotal + $shipping_fee;

        $db = Connection::get();
        $db->beginTransaction();

        try {
            // Tạo đơn hàng
            $order_id = Order::create([
                'user_id'        => $this->user_id,
                'full_name'      => $data['full_name'],
                'phone'          => $data['phone'],
                'address'        => $data['delivery_address'],
                'shipping_fee'   => $shipping_fee,
                'total_amount'   => $total_amount,
                'payment_method' => $data['payment_method'],
                'note'           => $data['note'] ?? ''
            ]);

            // Tạo chi tiết đơn và trừ kho
            foreach ($items_to_buy as $item) {
                Order::addDetail([
                    'order_id'     => $order_id,
                    'product_id'   => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'price'        => $item['price'],
                    'quantity'     => $item['quantity']
                ]);

                if (!Product::decreaseStock($item['product_id'], $item['quantity'])) {
                    throw new \Exception("Sản phẩm {$item['product_name']} không đủ số lượng.");
                }

                if ($data['payment_method'] !== 'VNPAY') {
                    Cart::removeItem($cart['cart_id'], $item['product_id']);
                }
            }

            // Xử lý thanh toán
            if ($data['payment_method'] === 'VNPAY') {
                $db->commit();
                $paymentCtrl = new PaymentController();
                $vnp_Url = $paymentCtrl->createPaymentUrl([
                    'order_id'   => $order_id,
                    'amount'     => $total_amount,
                    'order_desc' => "Thanh toan don hang #$order_id"
                ]);

                Response::json(['message' => 'Chuyển hướng đến VNPay', 'order_id' => $order_id, 'payment_url' => $vnp_Url]);
            } else {
                Order::addPaymentLog($order_id, 'COD', $total_amount, 'PENDING');
                $db->commit();
                Response::json(['message' => 'Đặt hàng thành công', 'order_id' => $order_id]);
            }
        } catch (\Exception $e) {
            $db->rollBack();
            Response::json(['error' => 'Lỗi đặt hàng: ' . $e->getMessage()], 500);
        }
    }

    // 3. Xử lý thanh toán lại: Cập nhật trạng thái đơn Pending/Cancelled và tạo link thanh toán mới
    public function retryPayment($data)
    {
        $this->authenticate();

        if (empty($data['order_id'])) Response::json(['error' => 'Thiếu mã đơn hàng'], 400);

        $order_id = $data['order_id'];
        $db = Connection::get();

        try {
            $db->beginTransaction();
            $order = Order::find($order_id);

            if (!$order || $order['user_id'] != $this->user_id) {
                Response::json(['error' => 'Đơn hàng không hợp lệ'], 404);
            }

            if (!in_array($order['status'], ['pending', 'cancelled'])) {
                Response::json(['error' => 'Đơn hàng này không thể thanh toán lại'], 400);
            }

            // Trừ lại kho (nếu cần thiết cho logic business)
            $orderDetails = Order::getDetails($order_id);
            foreach ($orderDetails as $item) {
                if (!Product::decreaseStock($item['product_id'], $item['quantity'])) {
                    throw new \Exception("Sản phẩm {$item['product_name']} hiện đã hết hàng.");
                }
            }

            // Cập nhật trạng thái về Pending để thanh toán
            $stmt = $db->prepare("UPDATE `orders` SET status = 'pending', payment_method = 'VNPAY' WHERE order_id = :id");
            $stmt->execute(['id' => $order_id]);
            $db->commit();

            // Tạo link thanh toán
            $paymentCtrl = new PaymentController();
            $vnp_Url = $paymentCtrl->createPaymentUrl([
                'order_id'   => $order_id,
                'amount'     => $order['total_amount'],
                'order_desc' => "Thanh toan lai don hang #$order_id"
            ]);

            Response::json(['message' => 'Tạo link thanh toán lại thành công', 'payment_url' => $vnp_Url]);
        } catch (\Exception $e) {
            $db->rollBack();
            Response::json(['error' => $e->getMessage()], 500);
        }
    }

    // 4. Lấy danh sách lịch sử đơn hàng của người dùng hiện tại
    public function orderHistory()
    {
        $this->authenticate();
        $orders = Order::getOrdersByUserId($this->user_id);
        return Response::json($orders ?: [], 200);
    }
}
