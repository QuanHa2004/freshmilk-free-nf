<?php

namespace Database;

use PDO;

class Connection
{
    // Singleton PDO instance
    private static $instance = null;

    // Lấy kết nối database (chỉ tạo 1 lần)
    public static function get()
    {
        if (!self::$instance) {

            // DSN (kèm charset để tránh lỗi font)
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

            // Cấu hình PDO
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Trả về dạng mảng
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4" // Thiết lập encoding
            ];

            self::$instance = new PDO(
                $dsn,
                DB_USER,
                DB_PASS,
                $options
            );
        }

        return self::$instance;
    }
}
