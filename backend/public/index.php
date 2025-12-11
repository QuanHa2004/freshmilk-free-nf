<?php
// 1. Bật debug (tắt khi chạy production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. Cấu hình CORS cho React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// =======================================================================
// PHẦN 1: XỬ LÝ FRONTEND (REACT)
// =======================================================================

$request_uri = $_SERVER['REQUEST_URI'];

// Nếu URL không phải /api hoặc /auth → trả về React index.html
if (strpos($request_uri, '/api') !== 0 && strpos($request_uri, '/auth') !== 0) {

    $reactIndexFile = __DIR__ . '/../../index.html';

    if (file_exists($reactIndexFile)) {
        header('Content-Type: text/html');
        readfile($reactIndexFile);
        exit; // Dừng tại đây, không chạy API
    } else {
        echo "<h1>Lỗi: Không tìm thấy index.html</h1>";
        echo "<p>Đường dẫn: " . $reactIndexFile . "</p>";
        echo "<p>Hãy copy file build của React vào thư mục htdocs.</p>";
        exit;
    }
}

// =======================================================================
// PHẦN 2: XỬ LÝ API BACKEND
// =======================================================================

header("Content-Type: application/json; charset=UTF-8");

// Lấy path từ URL
$path = parse_url($request_uri, PHP_URL_PATH);

// Chuẩn hóa URI
if (strpos($path, '/api') === 0) {
    $uri = substr($path, 4); // Bỏ /api
} else {
    $uri = $path; // Giữ nguyên (ví dụ /auth/google)
}

if (empty($uri) || $uri[0] !== '/') {
    $uri = '/' . $uri;
}

$method = $_SERVER["REQUEST_METHOD"];

// 3. Load config & vendor
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

// 4. Khởi tạo controllers
$auth       = new Controllers\AuthController();
$socialAuth = new Controllers\SocialAuthController();
$user       = new Controllers\Customer\UserController();
$category   = new Controllers\Customer\CategoryController();
$product    = new Controllers\Customer\ProductController();
$cart       = new Controllers\Customer\CartController();
$order      = new Controllers\Customer\OrderController();
$payment    = new Controllers\Customer\PaymentController();
$dashboard  = new Controllers\Admin\DashboardController();

// 5. Load route API
require_once __DIR__ . '/../src/Routes/api.php';

// 6. API không tồn tại → trả về 404
http_response_code(404);
echo json_encode([
    "error" => "API Not Found",
    "message" => "Đường dẫn API không tồn tại",
    "debug_uri_received" => $uri,
    "debug_original_path" => $path
], JSON_UNESCAPED_UNICODE);
exit;
?>
