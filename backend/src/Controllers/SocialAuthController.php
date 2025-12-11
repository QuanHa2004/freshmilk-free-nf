<?php

namespace Controllers;

use Models\User;
use Controllers\AuthController;

class SocialAuthController
{

    /* ============================================
       1. CHUYỂN NGƯỜI DÙNG SANG GOOGLE LOGIN
    ============================================ */
    public function redirectToGoogle()
    {
        if (!defined('GOOGLE_CLIENT_ID')) {
            die('Lỗi: GOOGLE_CLIENT_ID chưa được cấu hình');
        }

        $params = [
            'client_id'     => GOOGLE_CLIENT_ID,
            'redirect_uri'  => GOOGLE_REDIRECT_URL,
            'response_type' => 'code',
            'scope'         => 'email profile',
            'access_type'   => 'online',
            'prompt'        => 'select_account'
        ];

        $url = "https://accounts.google.com/o/oauth2/auth?" . http_build_query($params);
        header("Location: $url");
        exit;
    }


    /* ============================================
       2. GOOGLE CALLBACK – NHẬN CODE & LẤY USER INFO
    ============================================ */
    public function handleGoogleCallback()
    {
        // Không có code → đăng nhập thất bại
        if (!isset($_GET['code'])) {
            header("Location: https://freshmilk.free.nf/login?error=Google_Login_Failed");
            exit;
        }

        // A. Đổi code lấy access_token
        $tokenUrl = "https://oauth2.googleapis.com/token";
        $postData = [
            'code'          => $_GET['code'],
            'client_id'     => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'redirect_uri'  => GOOGLE_REDIRECT_URL,
            'grant_type'    => 'authorization_code'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $tokenUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        curl_close($ch);

        $tokenData = json_decode($response, true);

        if (empty($tokenData['access_token'])) {
            die("Lỗi: Không lấy được Access Token. Response: " . $response);
        }

        // B. Lấy thông tin user từ Google
        $userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $userInfoUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $tokenData['access_token']]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $userData = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $avatar = $userData['picture'] ?? null;

        // C. Xử lý login/register
        $this->processSocialLogin(
            $userData['email'],
            $userData['name'],
            'google_id',
            $userData['id'],
            $avatar
        );
    }


    /* ============================================
       3. LƯU USER + TẠO JWT TOKEN
    ============================================ */
    private function processSocialLogin($email, $name, $providerField, $socialId, $avatar = null)
    {
        $user = User::findByEmail($email);

        if ($user) {
            // Nếu user chưa có google_id → cập nhật
            if (empty($user['google_id'])) {
                User::updateGoogleInfo($user['user_id'], $socialId, $avatar);
            }

            $userId = $user['user_id'];
            $roleId = $user['role_id'];
        } else {
            // Tạo user mới
            $userId = User::createGoogleUser($name, $email, $socialId, $avatar);
            $roleId = 2; // Mặc định role user
        }

        // Tạo JWT token
        $authController = new AuthController();
        $token = $authController->generateToken($userId, $roleId);

        // Redirect về frontend kèm token
        header("Location: https://freshmilk.free.nf/login?social_token=$token");
        exit;
    }
}
