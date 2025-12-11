<?php

// Kiểm tra phiên bản PHP (Composer 2.3 trở lên yêu cầu PHP >= 5.6)
if (PHP_VERSION_ID < 50600) {

    // Gửi header lỗi nếu chưa gửi
    if (!headers_sent()) {
        header('HTTP/1.1 500 Internal Server Error');
    }

    // Thông báo lỗi phiên bản PHP
    $err = 'Composer 2.3.0 dropped support for autoloading on PHP <5.6 and you are running '
        . PHP_VERSION . ', please upgrade PHP or use Composer 2.2 LTS via "composer self-update --2.2". Aborting.' . PHP_EOL;

    // Hiển thị lỗi tùy theo môi trường
    if (!ini_get('display_errors')) {
        if (PHP_SAPI === 'cli' || PHP_SAPI === 'phpdbg') {
            fwrite(STDERR, $err);
        } elseif (!headers_sent()) {
            echo $err;
        }
    }

    throw new RuntimeException($err);
}

// Load file autoload của Composer
require_once __DIR__ . '/composer/autoload_real.php';

// Trả về autoloader
return ComposerAutoloaderInit86257b6a00b389e668af5613b5eeba63::getLoader();
