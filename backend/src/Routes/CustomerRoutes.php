<?php

/* ============================
   USER ROUTES
============================ */

if ($uri === "/users/update" && $method === "POST") {
    $user->updateUser(json_decode(file_get_contents('php://input'), true));
    exit;
}

/* ============================
   CATEGORY ROUTES
============================ */

if ($uri === "/categories" && $method === "GET") {
    $category->index();
    exit;
}


/* ============================
   PRODUCT ROUTES
============================ */

if ($uri === "/products" && $method === "GET") {
    $product->index();
    exit;
}

if (preg_match("#^/([0-9]+)/products$#", $uri, $matches) && $method === "GET") {
    $product->getByCategory($matches[1]);
    exit;
}

if (preg_match("#^/products/([0-9]+)$#", $uri, $matches) && $method === "GET") {
    $product->detail((int)$matches[1]);
    exit;
}

if (preg_match("#^/products/search/(.*)$#", $uri, $matches) && $method === "GET") {
    $product->search(urldecode($matches[1]));
    exit;
}


/* ============================
   CART ROUTES
============================ */

if ($uri === "/carts/add" && $method === "POST") {
    $cart->add(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match("#^/carts/remove/([0-9]+)$#", $uri, $matches) && $method === "POST") {
    $cart->remove((int)$matches[1]);
    exit;
}

if ($uri === "/carts/update" && $method === "POST") {
    $cart->update(json_decode(file_get_contents('php://input'), true));
    exit;
}

if (preg_match('#^/carts/(\d+)/status$#', $uri, $matches) && $method === "POST") {
    $cart->updateItemStatus((int)$matches[1], json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/carts/current_user" && $method === "GET") {
    $cart->myCart();
    exit;
}


/* ============================
   ORDER ROUTES
============================ */

if ($uri === "/orders/checkout" && $method === "POST") {
    $order->checkout(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/orders/retry" && $method === "POST") {
    $order->retryPayment(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/orders/history" && $method === "GET") {
    $order->orderHistory();
    exit;
}


/* ============================
   PAYMENT ROUTES
============================ */

if ($uri === "/checkout/process-vnpay" && $method === "POST") {
    $payment->createPaymentUrl(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/payment/vnpay_return" && $method === "GET") {
    $payment->vnpayReturn();
    exit;
}


/* ============================
   SOCIAL AUTH ROUTES
============================ */

if ($uri === "/auth/google" && $method === "GET") {
    $socialAuth->redirectToGoogle();
    exit;
}

if ($uri === "/auth/google/callback" && $method === "GET") {
    $socialAuth->handleGoogleCallback();
    exit;
}
