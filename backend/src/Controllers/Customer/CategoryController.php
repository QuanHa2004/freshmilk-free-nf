<?php

namespace Controllers\Customer;

use Models\Category;
use Helpers\Response;

class CategoryController {

    public function index() {
        return Response::json(Category::all());
    }
}
