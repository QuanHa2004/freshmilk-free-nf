<?php

// =======================================================================
// 1. CẤU HÌNH TOKEN (JWT)
// =======================================================================
define('SECRET_KEY', 'mysecretkey');
define('REFRESH_SECRET_KEY', 'myrefreshsecretkey');
define('ALGORITHM', 'HS256');
define('ACCESS_TOKEN_EXPIRE_MINUTES', 60);
define('REFRESH_TOKEN_EXPIRE_DAYS', 7);


// =======================================================================
// 2. CẤU HÌNH DATABASE (INFINITYFREE)
// =======================================================================
define('DB_HOST', 'sql104.infinityfree.com'); 
define('DB_NAME', 'if0_40616646_php_milk_project');
define('DB_USER', 'if0_40616646');
define('DB_PASS', 'wrLHOnm2L9Ll'); 


// =======================================================================
// 3. CẤU HÌNH VNPAY
// =======================================================================
define('VNPAY_TMN_CODE', 'RWERB2P2');
define('VNPAY_HASH_SECRET', '9IVACPOL7QYROWDQ5I5M2MTJX6VQPEF1');
define('VNPAY_PAYMENT_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
define('VNPAY_RETURN_URL', 'https://freshmilk.free.nf/api/payment/vnpay_return'); 
define('VNPAY_IPN_URL', 'https://freshmilk.free.nf/api/payment/vnpay_ipn');


// =======================================================================
// 4. CẤU HÌNH GOOGLE LOGIN
// =======================================================================
define('GOOGLE_CLIENT_ID', '699574451600-q6i4hv0darqh7rhccooihl1pl4ej82fm.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', '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');
define('GOOGLE_REDIRECT_URL', 'https://freshmilk.free.nf/auth/google/callback');


// =======================================================================
// 4. CẤU HÌNH DOMAIN
// =======================================================================
define('DOMAIN', 'freshmilk.free.nf')

?>