<?php

namespace Controllers\Customer;

use Helpers\Response;
use Controllers\AuthController;
use Models\User;

class UserController
{
    private $user_id;

    /* ============================
       1. XÁC THỰC NGƯỜI DÙNG
    ============================ */
    // Lấy user_id từ token
    private function authenticate()
    {
        $auth = new AuthController();
        try {
            $payload = $auth->decodeToken();
            $this->user_id = $payload->sub;
        } catch (\Exception $e) {
            Response::json(['error' => $e->getMessage()], 401);
        }
    }

    public function updateUser($data)
    {
        $this->authenticate();

        if (!$data) {
            Response::json(["error" => "Invalid JSON"], 400);
        }

        $updateData = [];

        if (isset($data["full_name"])) {
            $updateData["full_name"] = $data["full_name"];
        }

        if (isset($data["phone"])) {
            $updateData["phone"] = $data["phone"];
        }

        if (isset($data["address"])) {
            $updateData["address"] = $data["address"];
        }

        if (empty($updateData)) {
            Response::json(["error" => "No data to update"], 400);
        }

        $updated = User::updateUser($this->user_id, $updateData);

        if ($updated) {
            Response::json(["message" => "Updated successfully"], 200);
        } else {
            Response::json(["error" => "Database update failed"], 500);
        }
    }
}
