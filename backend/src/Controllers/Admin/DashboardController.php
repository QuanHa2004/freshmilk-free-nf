<?php

namespace Controllers\Admin;

use Database\Connection;
use Helpers\Response;
use Models\Category;
use Models\Product;
use Exception;
use PDO;

class DashboardController
{

    /* ============================
       BÁO CÁO – THỐNG KÊ
    ============================ */

    // Lấy báo cáo doanh thu, đơn hàng, khách mới trong tháng
    public function getReport()
    {
        $db = Connection::get();

        $current_month = date('m');
        $current_year = date('Y');

        $report_sql = "
            SELECT 
                SUM(total_amount) as total_revenue,
                COUNT(order_id) as total_orders
            FROM `orders`
            WHERE 
                MONTH(order_date) = :month AND 
                YEAR(order_date) = :year;
        ";

        $stmt = $db->prepare($report_sql);
        $stmt->execute(['month' => $current_month, 'year' => $current_year]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);

        $total_revenue = floatval($report['total_revenue'] ?? 0);
        $total_orders = intval($report['total_orders'] ?? 0);

        $customer_sql = "
            SELECT COUNT(user_id) as new_customer
            FROM `user`
            WHERE 
                role_id = 2 AND 
                MONTH(created_at) = :month AND 
                YEAR(created_at) = :year;
        ";

        $stmt = $db->prepare($customer_sql);
        $stmt->execute(['month' => $current_month, 'year' => $current_year]);
        $new_customer_data = $stmt->fetch(PDO::FETCH_ASSOC);
        $new_customer = intval($new_customer_data['new_customer'] ?? 0);

        $avg_value = ($total_orders > 0) ? ($total_revenue / $total_orders) : 0;

        Response::json([
            "total_revenue" => round($total_revenue, 2),
            "total_orders" => $total_orders,
            "new_customer" => $new_customer,
            "avg_value" => round($avg_value, 2),
        ]);
    }


    /* ============================
       LẤY DANH SÁCH DỮ LIỆU
    ============================ */

    // Lấy danh sách đơn hàng
    public function getOrders()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                o.order_id,
                u.full_name,
                o.order_date,
                o.total_amount,
                o.status
            FROM `orders` o
            JOIN `user` u ON o.user_id = u.user_id
            WHERE u.is_deleted = 0
            ORDER BY o.order_date DESC;
        ";

        $stmt = $db->query($sql);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json($orders);
    }

    // Lấy danh sách danh mục kèm tổng số lượng sản phẩm
    public function getCategories()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                c.category_id, 
                c.category_name,
                COALESCE(SUM(p.quantity), 0) AS quantity
            FROM category c
            LEFT JOIN product p 
                ON c.category_id = p.category_id AND p.is_deleted = 0
            GROUP BY c.category_id, c.category_name 
            ORDER BY c.category_id;
        ";

        $stmt = $db->query($sql);
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json($categories);
    }

    // Lấy danh sách sản phẩm
    public function getProducts()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                product_id,
                product_name,
                price,
                is_deleted,
                is_hot,
                quantity,      
                created_at
            FROM product
            ORDER BY product_id DESC;
        ";

        $stmt = $db->query($sql);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json($products);
    }


    /* ============================
       THÊM MỚI DỮ LIỆU
    ============================ */

    // Thêm danh mục mới
    public function addCategory($data)
    {
        if (empty($data['category_name'])) {
            Response::json(['error' => 'Vui lòng nhập tên danh mục'], 400);
        }

        $name = trim($data['category_name']);

        try {
            if (Category::exists($name)) {
                Response::json(['error' => 'Tên danh mục này đã tồn tại'], 409);
            }

            $id = Category::create($name);

            Response::json([
                'message' => 'Thêm danh mục thành công',
                'category_id' => $id
            ]);
        } catch (\PDOException $e) {
            Response::json(['error' => 'Lỗi cơ sở dữ liệu: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Response::json(['error' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    // Thêm sản phẩm mới
    public function addProduct($data)
    {
        if (empty($data['product_name']) || empty($data['category_id']) || !isset($data['price']) || !isset($data['quantity'])) {
            Response::json(['error' => 'Vui lòng điền đầy đủ: Tên SP, Danh mục, Giá và Số lượng'], 400);
        }

        if (!is_numeric($data['price']) || $data['price'] < 0) {
            Response::json(['error' => 'Giá sản phẩm không hợp lệ'], 400);
        }

        if (!is_numeric($data['quantity']) || $data['quantity'] < 0) {
            Response::json(['error' => 'Số lượng kho không hợp lệ'], 400);
        }

        try {
            $newId = Product::create($data);

            Response::json([
                'message' => 'Thêm sản phẩm thành công',
                'product_id' => $newId
            ], 201);
        } catch (\PDOException $e) {
            if ($e->getCode() == '23000') {
                Response::json(['error' => 'Danh mục không tồn tại hoặc dữ liệu ràng buộc sai'], 400);
            }
            Response::json(['error' => 'Lỗi Database: ' . $e->getMessage()], 500);
        } catch (Exception $e) {
            Response::json(['error' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }
}
