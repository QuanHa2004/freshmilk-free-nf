<?php

if ($uri === "/register" && $method === "POST") {
    $auth->register(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/login" && $method === "POST") {
    $auth->login(json_decode(file_get_contents('php://input'), true));
    exit;
}

if ($uri === "/current_user" && $method === "GET") {
    $auth->profile();
    exit;
}
