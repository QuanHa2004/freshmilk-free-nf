<?php

namespace Models;

use Database\Connection;
use PDO;

class Cart
{
    /* ============================
       1. LẤY / TẠO GIỎ HÀNG
    ============================ */

    // Lấy giỏ hàng theo user_id
    public static function getCartByUserId($user_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT cart_id FROM cart WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Tạo giỏ hàng mới cho user
    public static function findOrCreate($user_id) {
        $db = Connection::get();
        
        // 1. Tìm xem user đã có giỏ chưa
        $stmt = $db->prepare("SELECT cart_id FROM cart WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) {
            return $cart['cart_id']; // Có rồi thì trả về ID
        }

        // 2. Chưa có thì tạo mới
        $stmt = $db->prepare("INSERT INTO cart (user_id, created_at) VALUES (:user_id, NOW())");
        $stmt->execute(['user_id' => $user_id]);
        
        return $db->lastInsertId();
    }


    /* ============================
       2. LẤY DANH SÁCH SẢN PHẨM
    ============================ */

    // Lấy toàn bộ sản phẩm trong giỏ
    public static function getCartItems($cart_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            SELECT ci.quantity, ci.is_checked, 
                   p.product_id, p.product_name, p.description, p.image_url, p.price
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            WHERE ci.cart_id = :cart_id
        ");
        $stmt->execute(['cart_id' => $cart_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       3. THÊM / XÓA / CẬP NHẬT SỐ LƯỢNG
    ============================ */

    // Thêm sản phẩm vào giỏ (tăng số lượng nếu đã tồn tại)
    public static function addItem($cart_id, $product_id, $quantity)
    {
        $db = Connection::get();

        $stmt = $db->prepare("SELECT * FROM cart_item WHERE cart_id = :cart_id AND product_id = :product_id");
        $stmt->execute(['cart_id' => $cart_id, 'product_id' => $product_id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($item) {
            // Tăng số lượng
            $stmt = $db->prepare("
                UPDATE cart_item 
                SET quantity = quantity + :qty 
                WHERE cart_id = :cart_id AND product_id = :product_id
            ");
            $stmt->execute([
                'qty' => $quantity,
                'cart_id' => $cart_id,
                'product_id' => $product_id
            ]);
        } else {
            // Thêm mới
            $stmt = $db->prepare("
                INSERT INTO cart_item (cart_id, product_id, quantity, is_checked) 
                VALUES (:cart_id, :product_id, :quantity, 0)
            ");
            $stmt->execute([
                'cart_id' => $cart_id,
                'product_id' => $product_id,
                'quantity' => $quantity
            ]);
        }
    }

    // Xóa sản phẩm khỏi giỏ
    public static function removeItem($cart_id, $product_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            DELETE FROM cart_item 
            WHERE cart_id = :cart_id AND product_id = :product_id
        ");
        $stmt->execute(['cart_id' => $cart_id, 'product_id' => $product_id]);
        return $stmt->rowCount();
    }

    // Cập nhật số lượng sản phẩm
    public static function updateItemQuantity($cart_id, $product_id, $quantity)
    {
        $db = Connection::get();

        // Nếu số lượng <= 0 → xóa sản phẩm
        if ($quantity <= 0) {
            return self::removeItem($cart_id, $product_id);
        }

        $stmt = $db->prepare("
            UPDATE cart_item 
            SET quantity = :quantity 
            WHERE cart_id = :cart_id AND product_id = :product_id
        ");
        $stmt->execute([
            'quantity' => $quantity,
            'cart_id' => $cart_id,
            'product_id' => $product_id
        ]);

        return $stmt->rowCount();
    }


    /* ============================
       4. CẬP NHẬT TRẠNG THÁI CHỌN
    ============================ */

    // Đánh dấu sản phẩm được chọn / bỏ chọn
    public static function updateItemStatus($cart_id, $product_id, $is_checked)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            UPDATE cart_item 
            SET is_checked = :is_checked 
            WHERE cart_id = :cart_id AND product_id = :product_id
        ");
        $stmt->execute([
            'is_checked' => $is_checked ? 1 : 0,
            'cart_id' => $cart_id,
            'product_id' => $product_id
        ]);

        return $stmt->rowCount();
    }


    /* ============================
       5. XÓA SẢN PHẨM ĐÃ CHỌN
    ============================ */

    // Xóa toàn bộ sản phẩm có is_checked = 1
    public static function clearCart($cart_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            DELETE FROM cart_item 
            WHERE cart_id = :cart_id AND is_checked = 1
        ");
        $stmt->execute(['cart_id' => $cart_id]);
    }
}
