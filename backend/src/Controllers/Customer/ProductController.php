<?php

namespace Controllers\Customer;

use Models\Product;
use Helpers\Response;

class ProductController
{

    /* ============================
       1. LẤY TẤT CẢ SẢN PHẨM
    ============================ */
    // Trả về toàn bộ danh sách sản phẩm
    public function index()
    {
        return Response::json(Product::all());
    }

    /* ============================
       2. LẤY SẢN PHẨM THEO DANH MỤC
    ============================ */
    // Lấy danh sách sản phẩm theo category_id
    public function getByCategory($category_id)
    {
        $products = Product::getByCategory($category_id);
        Response::json($products);
    }

    /* ============================
       3. LẤY CHI TIẾT SẢN PHẨM
    ============================ */
    // Lấy thông tin chi tiết của 1 sản phẩm
    public function detail($product_id)
    {
        $product = Product::find($product_id);

        if (!$product) {
            Response::json(['error' => 'Sản phẩm không tồn tại'], 404);
        }

        Response::json($product);
    }

    /* ============================
       4. TÌM KIẾM SẢN PHẨM
    ============================ */
    // Tìm sản phẩm theo tên
    public function search($search_name)
    {
        $products = Product::searchByName($search_name);

        if (!$products) {
            Response::json(['error' => 'Không tìm thấy sản phẩm'], 404);
        }

        Response::json($products);
    }
}
