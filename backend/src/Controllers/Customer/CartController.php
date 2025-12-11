<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Models\Cart;

class CartController
{
    private $user_id;

    /* ============================
       1. XÁC THỰC NGƯỜI DÙNG
    ============================ */
    // Lấy user_id từ token
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


    /* ============================
       2. THÊM / XÓA / CẬP NHẬT GIỎ HÀNG
    ============================ */

    // Thêm sản phẩm vào giỏ
    public function add($data)
    {
        $this->authenticate();

        if (!isset($data['product_id']) || !isset($data['quantity'])) {
            Response::json(['error' => 'Thiếu thông tin product_id hoặc quantity'], 400);
        }

        $cart_id = Cart::findOrCreate($this->user_id);

        Cart::addItem($cart_id, $data['product_id'], $data['quantity']);

        Response::json([
            'message' => 'Đã thêm sản phẩm vào giỏ hàng',
            'cart_id' => $cart_id,
            'product_id' => $data['product_id'],
            'quantity_added' => $data['quantity']
        ]);
    }

    // Xóa sản phẩm khỏi giỏ
    public function remove($product_id)
    {
        $this->authenticate();
        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) Response::json(['error' => 'Giỏ hàng trống'], 404);

        $deleted = Cart::removeItem($cart['cart_id'], $product_id);

        if ($deleted > 0) {
            Response::json(['message' => "Đã xóa sản phẩm $product_id khỏi giỏ hàng"]);
        } else {
            Response::json(['error' => 'Sản phẩm không có trong giỏ hàng'], 404);
        }
    }

    // Cập nhật số lượng sản phẩm
    public function update($data)
    {
        $this->authenticate();
        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) Response::json(['error' => 'Giỏ hàng không tồn tại'], 404);
        if (!isset($data['product_id']) || !isset($data['quantity'])) {
            Response::json(['error' => 'Thiếu dữ liệu'], 400);
        }

        Cart::updateItemQuantity($cart['cart_id'], $data['product_id'], $data['quantity']);

        Response::json(['message' => 'Cập nhật thành công']);
    }


    /* ============================
       3. LẤY GIỎ HÀNG HIỆN TẠI
    ============================ */

    // Lấy toàn bộ giỏ hàng của user
    public function myCart()
    {
        $this->authenticate();
        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) {
            Response::json([
                'user_id' => $this->user_id,
                'cart_id' => null,
                'items' => [],
                'total_price' => 0
            ]);
        }

        $cart_items = Cart::getCartItems($cart['cart_id']);
        $items = [];
        $total_price = 0;

        foreach ($cart_items as $ci) {
            $price = floatval($ci['price']);
            $qty = intval($ci['quantity']);
            $total_amount = $price * $qty;
            $total_price += $total_amount;

            $items[] = [
                'product_id'   => $ci['product_id'],
                'product_name' => $ci['product_name'],
                'description'  => $ci['description'],
                'image_url'    => $ci['image_url'],
                'price'        => $price,
                'quantity'     => $qty,
                'total'        => $total_amount,
                'is_checked'   => (bool)$ci['is_checked']
            ];
        }

        Response::json([
            'user_id'     => $this->user_id,
            'cart_id'     => $cart['cart_id'],
            'items'       => $items,
            'total_price' => $total_price
        ]);
    }


    /* ============================
       4. CẬP NHẬT TRẠNG THÁI CHỌN SẢN PHẨM
    ============================ */

    // Đánh dấu sản phẩm được chọn / bỏ chọn
    public function updateItemStatus($product_id, $data)
    {
        $this->authenticate();
        $cart = Cart::getCartByUserId($this->user_id);

        if (!$cart) Response::json(['error' => 'Giỏ hàng không tồn tại'], 404);
        if (!isset($data['is_checked']) || !is_bool($data['is_checked'])) {
            Response::json(['error' => 'Dữ liệu trạng thái không hợp lệ'], 400);
        }

        Cart::updateItemStatus($cart['cart_id'], $product_id, $data['is_checked']);

        Response::json(['message' => 'Cập nhật trạng thái thành công']);
    }
}
