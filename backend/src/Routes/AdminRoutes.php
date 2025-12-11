<?php

// =========================
// ADMIN GET ROUTES
// =========================
if ($uri === "/admin/reports" && $method === "GET") {
    $dashboard->getReport();
    exit;
}

if ($uri === "/admin/orders" && $method === "GET") {
    $dashboard->getOrders();
    exit;
}

if ($uri === "/admin/categories" && $method === "GET") {
    $dashboard->getCategories(); 
    exit;
}

if ($uri === "/admin/products" && $method === "GET") {
    $dashboard->getProducts();
    exit;
}


// =========================
// ADMIN POST ROUTES
// =========================
if ($uri === "/admin/categories" && $method === "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $dashboard->addCategory($data);
    exit;
}

if ($uri === "/admin/products" && $method === "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $dashboard->addProduct($data);
    exit;
}
