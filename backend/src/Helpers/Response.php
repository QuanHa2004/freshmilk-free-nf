<?php

namespace Helpers;

class Response
{

    // Trả về JSON kèm mã trạng thái HTTP
    public static function json($data, $status = 200)
    {
        http_response_code($status);
        header("Content-Type: application/json");
        echo json_encode($data);
        exit;
    }
}
