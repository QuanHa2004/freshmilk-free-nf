<?php

namespace Models;

use Database\Connection;
use PDO;

class User
{
    /* ============================
       1. TÌM USER THEO EMAIL
    ============================ */
    // Lấy thông tin user bằng email (dùng cho login thường & Google)
    public static function findByEmail($email)
    {
        $db = Connection::get();
        $stmt = $db->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }


    /* ============================
       2. TẠO USER ĐĂNG KÝ THƯỜNG
    ============================ */
    // Tạo user mới từ form đăng ký
    public static function create($full_name, $email, $password_hash)
    {
        $db = Connection::get();
        $role_id = 2; // Mặc định Customer

        $sql = "INSERT INTO user (full_name, email, password_hash, role_id, created_at) 
                VALUES (:name, :email, :pass, :role, NOW())";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'name'  => $full_name,
            'email' => $email,
            'pass'  => $password_hash,
            'role'  => $role_id
        ]);

        return $db->lastInsertId();
    }


    /* ============================
       3. CẬP NHẬT GOOGLE ID + AVATAR
    ============================ */
    // Dùng khi user đã có tài khoản thường, giờ login bằng Google
    public static function updateGoogleInfo($user_id, $google_id, $avatar_url)
    {
        $db = Connection::get();

        $sql = "UPDATE user 
                SET google_id = :google_id,
                    avatar_url = :avatar_url
                WHERE user_id = :user_id";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'google_id' => $google_id,
            'avatar_url' => $avatar_url,
            'user_id'   => $user_id
        ]);
    }


    /* ============================
       4. TẠO USER MỚI BẰNG GOOGLE
    ============================ */
    // Tự động tạo user khi đăng nhập Google lần đầu
    public static function createGoogleUser($fullName, $email, $google_id, $avatar_url)
    {
        $db = Connection::get();
        $role_id = 2;

        $sql = "INSERT INTO user (full_name, email, password_hash, role_id, google_id, avatar_url, created_at) 
                VALUES (:name, :email, NULL, :role, :google_id, :avatar, NOW())";

        $stmt = $db->prepare($sql);
        $stmt->execute([
            'name'      => $fullName,
            'email'     => $email,
            'role'      => $role_id,
            'google_id' => $google_id,
            'avatar'    => $avatar_url
        ]);

        return $db->lastInsertId();
    }

    /* 5. Cập nhật thông tin user (full_name, phone, address, avatar) */
    public static function updateUser($user_id, $data)
    {
        $db = Connection::get();

        if (empty($data)) return false;

        $fields = [];
        $params = [];

        foreach ($data as $key => $value) {
            $allowed = ["full_name", "phone", "address", "avatar_url"];
            if (!in_array($key, $allowed)) continue;

            $fields[] = "$key = ?";
            $params[] = $value;
        }

        if (empty($fields)) return false;

        $params[] = $user_id;

        $sql = "UPDATE user SET " . implode(", ", $fields) . " WHERE user_id = ?";

        $stmt = $db->prepare($sql);
        return $stmt->execute($params);
    }
}
