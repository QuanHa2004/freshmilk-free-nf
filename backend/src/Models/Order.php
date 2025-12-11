<?php

namespace Models;

use Database\Connection;
use PDO;

class Order
{
    /* 1. Tạo đơn hàng mới */
    public static function create($data)
    {
        $db = Connection::get();

        // Xử lý ngày giao hàng
        $delivery_date = $data['delivery_date'] ?? null;

        if (empty($delivery_date)) {
            $delivery_date = date('Y-m-d H:i:s', strtotime('+3 days'));
        } elseif (is_numeric($delivery_date)) {
            $delivery_date = date('Y-m-d H:i:s', $delivery_date);
        }

        $sql = "INSERT INTO `orders` (
                    user_id, status,
                    full_name, phone, delivery_address,
                    delivery_date, order_date,
                    shipping_fee, total_amount,
                    payment_method, note, is_paid
                ) VALUES (
                    :user_id, 'pending',
                    :full_name, :phone, :delivery_address,
                    :delivery_date, NOW(),
                    :shipping_fee, :total_amount,
                    :payment_method, :note, 0
                )";

        $stmt = $db->prepare($sql);

        $stmt->execute([
            'user_id'          => $data['user_id'],
            'full_name'        => $data['full_name'],
            'phone'            => $data['phone'],
            'delivery_address' => $data['address'],
            'delivery_date'    => $delivery_date,
            'shipping_fee'     => $data['shipping_fee'] ?? 0,
            'total_amount'     => $data['total_amount'],
            'payment_method'   => $data['payment_method'],
            'note'             => $data['note'] ?? ''
        ]);

        return $db->lastInsertId();
    }

    /* 2. Thêm chi tiết sản phẩm vào đơn hàng */
    public static function addDetail($item)
    {
        $db = Connection::get();

        $total_item_amount = $item['price'] * $item['quantity'];

        $sql = "INSERT INTO order_detail (
                    order_id, product_id,
                    product_name, price, quantity,
                    total_item_amount
                ) VALUES (
                    :order_id, :product_id,
                    :product_name, :price, :quantity,
                    :total_item_amount
                )";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'order_id'          => $item['order_id'],
            'product_id'        => $item['product_id'],
            'product_name'      => $item['product_name'],
            'price'             => $item['price'],
            'quantity'          => $item['quantity'],
            'total_item_amount' => $total_item_amount
        ]);
    }

    /* 3. Ghi log thanh toán vào bảng payments */
    public static function addPaymentLog($order_id, $method, $amount, $status = 'PENDING', $extraData = [])
    {
        $db = Connection::get();

        $transaction_code = $extraData['transaction_code'] ?? null;
        $bank_code        = $extraData['bank_code'] ?? null;
        $response_code    = $extraData['response_code'] ?? null;
        $note             = $extraData['note'] ?? '';

        $sql = "INSERT INTO `payments` (
                    order_id, payment_method,
                    transaction_code, bank_code, response_code,
                    amount, status, payment_time, note
                ) VALUES (
                    :order_id, :payment_method,
                    :transaction_code, :bank_code, :response_code,
                    :amount, :status, NOW(), :note
                )";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'order_id'         => $order_id,
            'payment_method'   => $method,
            'transaction_code' => $transaction_code,
            'bank_code'        => $bank_code,
            'response_code'    => $response_code,
            'amount'           => $amount,
            'status'           => $status,
            'note'             => $note
        ]);
    }

    /* 4. Cập nhật trạng thái đơn hàng */
    public static function updateStatus($order_id, $status, $is_paid = false)
    {
        $db = Connection::get();
        $paid_val = $is_paid ? 1 : 0;

        $sql = "UPDATE `orders` 
                SET status = :status, is_paid = :is_paid 
                WHERE order_id = :order_id";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'status'   => $status,
            'is_paid'  => $paid_val,
            'order_id' => $order_id
        ]);
    }

    /* 5. Lấy thông tin đơn hàng theo ID */
    public static function find($order_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT * FROM `orders` WHERE order_id = :id");
        $stmt->execute(['id' => $order_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /* 6. Lấy danh sách sản phẩm trong đơn hàng */
    public static function getDetails($order_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT * FROM order_detail WHERE order_id = :id");
        $stmt->execute(['id' => $order_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* 7. Lấy danh sách đơn hàng theo user_id */
    public static function getOrdersByUserId($user_id)
    {
        $db = Connection::get();
        $stmt = $db->prepare("
            SELECT * FROM orders 
            WHERE user_id = :id 
            ORDER BY order_date DESC
        ");
        $stmt->execute(['id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
