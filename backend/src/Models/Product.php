<?php

namespace Models;

use Database\Connection;
use PDO;
use PDOException;

class Product
{
    /* ============================
       1. LẤY TẤT CẢ SẢN PHẨM
    ============================ */
    // Trả về danh sách sản phẩm (kèm tên danh mục)
    public static function all()
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.price,
                p.quantity,
                p.discount_percent,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            WHERE p.is_deleted = 0
            ORDER BY p.product_id DESC
        ";

        return $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       2. LẤY SẢN PHẨM THEO DANH MỤC
    ============================ */
    // Lấy danh sách sản phẩm theo category_id
    public static function getByCategory($category_id)
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.product_id,
                p.product_name,
                p.category_id,
                c.category_name,
                p.price,
                p.quantity,
                p.discount_percent,
                p.image_url,
                p.description,
                p.created_at,
                p.is_hot
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            WHERE p.category_id = :category_id AND p.is_deleted = 0
            ORDER BY p.product_id DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['category_id' => $category_id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       3. LẤY CHI TIẾT SẢN PHẨM
    ============================ */
    // Lấy thông tin sản phẩm + product_detail
    public static function find($product_id)
    {
        $db = Connection::get();

        $sql = "
            SELECT 
                p.*, 
                pd.origin, pd.ingredients, pd.`usage`, pd.storage,
                pd.calories, pd.protein, pd.fat, pd.carbohydrates, pd.sugar,
                pd.vitamins, pd.minerals, pd.other_nutrients
            FROM product p
            LEFT JOIN product_detail pd ON p.product_id = pd.product_id
            WHERE p.product_id = :product_id AND p.is_deleted = 0
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute(['product_id' => $product_id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


    /* ============================
       4. TÌM KIẾM SẢN PHẨM
    ============================ */
    // Tìm sản phẩm theo tên
    public static function searchByName($search_name)
    {
        $db = Connection::get();
        $search_name = trim($search_name);
        $sql = "SELECT product_id, product_name, category_id, price, quantity, discount_percent, image_url, description 
            FROM product 
            WHERE product_name LIKE :search_name 
            AND is_deleted = 0"; 
        $stmt = $db->prepare($sql);
        $stmt->execute(['search_name' => "%$search_name%"]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /* ============================
       5. CẬP NHẬT KHO (TĂNG / GIẢM)
    ============================ */
    // Cộng số lượng kho
    public static function increaseStock($product_id, $quantity)
    {
        $db = Connection::get();

        $stmt = $db->prepare("
            UPDATE product 
            SET quantity = quantity + :quantity 
            WHERE product_id = :product_id
        ");

        return $stmt->execute([
            'quantity' => $quantity,
            'product_id' => $product_id
        ]);
    }

    // Trừ số lượng kho (chỉ trừ khi đủ hàng)
    public static function decreaseStock($product_id, $quantity)
    {
        $db = Connection::get();

        $stmt = $db->prepare("
            UPDATE product 
            SET quantity = quantity - :quantity 
            WHERE product_id = :product_id AND quantity >= :quantity
        ");

        $stmt->execute([
            'quantity' => $quantity,
            'product_id' => $product_id
        ]);

        return $stmt->rowCount() > 0;
    }


    /* ============================
       6. TẠO SẢN PHẨM MỚI
    ============================ */
    // Tạo sản phẩm + product_detail trong transaction
    public static function create($data)
    {
        $db = Connection::get();

        try {
            $db->beginTransaction();

            /* --- A. INSERT PRODUCT --- */
            $sqlProduct = "
                INSERT INTO product (
                    product_name, category_id, price, quantity,
                    discount_percent, image_url, description, is_hot, created_at
                ) VALUES (
                    :name, :cat_id, :price, :qty,
                    :discount, :img, :desc, :is_hot, NOW()
                )
            ";

            $stmt = $db->prepare($sqlProduct);
            $stmt->execute([
                'name'      => $data['product_name'],
                'cat_id'    => $data['category_id'],
                'price'     => $data['price'],
                'qty'       => $data['quantity'],
                'discount'  => $data['discount_percent'] ?? 0,
                'img'       => $data['image_url'] ?? null,
                'desc'      => $data['description'] ?? null,
                'is_hot'    => !empty($data['is_hot']) ? 1 : 0
            ]);

            $productId = $db->lastInsertId();


            /* --- B. INSERT PRODUCT_DETAIL --- */
            $vitamins = !empty($data['vitamins']) ? json_encode($data['vitamins'], JSON_UNESCAPED_UNICODE) : null;
            $minerals = !empty($data['minerals']) ? json_encode($data['minerals'], JSON_UNESCAPED_UNICODE) : null;

            $sqlDetail = "
                INSERT INTO product_detail (
                    product_id, origin, ingredients, `usage`, storage,
                    calories, protein, fat, carbohydrates, sugar,
                    vitamins, minerals, other_nutrients
                ) VALUES (
                    :id, :origin, :ingredients, :usage, :storage,
                    :cal, :prot, :fat, :carb, :sugar,
                    :vit, :min, :other
                )
            ";

            $stmtDetail = $db->prepare($sqlDetail);
            $stmtDetail->execute([
                'id'          => $productId,
                'origin'      => $data['origin'] ?? null,
                'ingredients' => $data['ingredients'] ?? null,
                'usage'       => $data['usage'] ?? null,
                'storage'     => $data['storage'] ?? null,
                'cal'         => $data['calories'] ?? 0,
                'prot'        => $data['protein'] ?? 0,
                'fat'         => $data['fat'] ?? 0,
                'carb'        => $data['carbohydrates'] ?? 0,
                'sugar'       => $data['sugar'] ?? 0,
                'vit'         => $vitamins,
                'min'         => $minerals,
                'other'       => $data['other_nutrients'] ?? null
            ]);

            $db->commit();
            return $productId;
        } catch (PDOException $e) {
            $db->rollBack();
            throw $e;
        }
    }
}
