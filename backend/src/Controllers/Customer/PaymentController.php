<?php

namespace Controllers\Customer;

use Models\Order;
use Models\Product;
use Models\Cart;

class PaymentController
{
    /* ============================================
       1. TẠO URL THANH TOÁN VNPAY
    ============================================ */
    public function createPaymentUrl($data)
    {
        // Set múi giờ VN (bắt buộc trên InfinityFree)
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        // Kiểm tra dữ liệu
        if (empty($data['order_id']) || empty($data['amount'])) {
            return null;
        }

        $orderId   = $data['order_id'];
        $amount    = $data['amount'];
        $orderDesc = $data['order_desc'] ?? "Thanh toan don hang #$orderId";

        // Cấu hình VNPay
        $vnp_TmnCode    = VNPAY_TMN_CODE;
        $vnp_HashSecret = VNPAY_HASH_SECRET;
        $vnp_Url        = VNPAY_PAYMENT_URL;
        $vnp_Returnurl  = VNPAY_RETURN_URL;

        // Mã giao dịch duy nhất
        $vnp_TxnRef = $orderId . "_" . date('His');

        // Thời gian tạo & hết hạn (15 phút)
        $vnp_CreateDate = date('YmdHis');
        $vnp_ExpireDate = date('YmdHis', strtotime('+15 minutes', strtotime($vnp_CreateDate)));

        $inputData = [
            "vnp_Version"    => "2.1.0",
            "vnp_TmnCode"    => $vnp_TmnCode,
            "vnp_Amount"     => (int)$amount * 100, // Ép int để tránh lỗi số
            "vnp_Command"    => "pay",
            "vnp_CreateDate" => $vnp_CreateDate,
            "vnp_ExpireDate" => $vnp_ExpireDate,
            "vnp_CurrCode"   => "VND",
            "vnp_IpAddr"     => "127.0.0.1",
            "vnp_Locale"     => "vn",
            "vnp_OrderInfo"  => $orderDesc,
            "vnp_OrderType"  => "billpayment",
            "vnp_ReturnUrl"  => $vnp_Returnurl,
            "vnp_TxnRef"     => $vnp_TxnRef
        ];

        ksort($inputData);

        // Tạo query & hash
        $query = "";
        $hashdata = "";
        $i = 0;

        foreach ($inputData as $key => $value) {
            $prefix = $i ? '&' : '';
            $hashdata .= $prefix . urlencode($key) . "=" . urlencode($value);
            $query    .= $prefix . urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }

        $vnp_Url = $vnp_Url . "?" . $query;

        // Tạo chữ ký bảo mật
        if (!empty($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
        }

        echo json_encode(['payment_url' => $vnp_Url]);
        exit;
    }

    /* ============================================
       2. XỬ LÝ KHI VNPAY TRẢ VỀ (RETURN URL)
    ============================================ */
    public function vnpayReturn()
    {
        // Kiểm tra chữ ký
        if (empty($_GET['vnp_SecureHash'])) {
            header("Location: https://freshmilk.free.nf/checkout/failed?msg=Invalid_Access");
            exit;
        }

        $vnp_SecureHash = $_GET['vnp_SecureHash'];
        $inputData = [];

        // Lấy các tham số vnp_
        foreach ($_GET as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        unset($inputData['vnp_SecureHash']);
        ksort($inputData);

        // Tạo chuỗi hash
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            $hashData .= ($i ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }

        $secureHash = hash_hmac('sha512', $hashData, VNPAY_HASH_SECRET);

        // So sánh chữ ký
        if ($secureHash == $vnp_SecureHash) {

            // Lấy Order ID từ TxnRef
            $parts = explode('_', $_GET['vnp_TxnRef']);
            $order_id = intval($parts[0]);

            $vnp_ResponseCode = $_GET['vnp_ResponseCode'];
            $vnp_TransactionNo = $_GET['vnp_TransactionNo'];
            $vnp_BankCode = $_GET['vnp_BankCode'];
            $vnp_Amount = $_GET['vnp_Amount'] / 100;

            // Ghi log giao dịch
            try {
                Order::addPaymentLog(
                    $order_id,
                    'VNPAY',
                    $vnp_Amount,
                    $vnp_ResponseCode == '00' ? 'SUCCESS' : 'FAILED',
                    [
                        'transaction_code' => $vnp_TransactionNo,
                        'bank_code'        => $vnp_BankCode,
                        'response_code'    => $vnp_ResponseCode,
                        'note'             => 'VNPay Return'
                    ]
                );
            } catch (\Exception $e) {
            }

            // Thanh toán thành công
            if ($vnp_ResponseCode == '00') {

                Order::updateStatus($order_id, 'processing', true);

                // Xóa giỏ hàng
                $order = Order::find($order_id);
                if ($order) {
                    $cart = Cart::getCartByUserId($order['user_id']);
                    if ($cart) {
                        $orderDetails = Order::getDetails($order_id);
                        foreach ($orderDetails as $detail) {
                            Cart::removeItem($cart['cart_id'], $detail['product_id']);
                        }
                    }
                }

                header("Location: https://freshmilk.free.nf/checkout/success?order_id=$order_id&error_code=$vnp_ResponseCode");
                exit;
            }

            // Thanh toán thất bại
            Order::updateStatus($order_id, 'cancelled', false);

            // Hoàn lại kho
            $orderDetails = Order::getDetails($order_id);
            if ($orderDetails) {
                foreach ($orderDetails as $detail) {
                    Product::increaseStock($detail['product_id'], $detail['quantity']);
                }
            }

            header("Location: https://freshmilk.free.nf/checkout/failed?order_id=$order_id&error_code=$vnp_ResponseCode");
            exit;
        } else {
            // Sai chữ ký
            header("Location: https://frshmilk.free.nf/checkout/failed?msg=Invalid_Signature");
            exit;
        }
    }
}
