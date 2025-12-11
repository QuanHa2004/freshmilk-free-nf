import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './protected-routes';

// auth
import Login from '../pages/login';
import Registration from '../pages/registration';

// admin pages
import Dashboard from '../pages/admin/dashboard';
import Order from '../pages/admin/order-management';
import CategoryManagement from '../pages/admin/category-management';
import ProductManagement from '../pages/admin/product-management';
import AddCategory from '../pages/admin/add-category';
import AddProduct from '../pages/admin/add-product';

// customer pages
import Home from '../pages/customer/home';
import Profile from '../pages/customer/profile';
import Product from '../pages/customer/product';
import ProductDetail from '../pages/customer/product-detail';
import Cart from '../pages/customer/cart';
import Checkout from '../pages/customer/checkout';
import CheckoutSuccess from "../pages/customer/checkout-success";
import CheckoutFailed from "../pages/customer/checkout-failed";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ==== Auth ==== */}
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />

      {/* ==== Admin (có bảo vệ) ==== */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/order" element={<Order />} />
        <Route path="/admin/category" element={<CategoryManagement />} />
        <Route path="/admin/product" element={<ProductManagement />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
      </Route>

      {/* ==== Customer ==== */}
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<Product />} />
      <Route path="/categories/:category_id/products" element={<Product />} />
      <Route path="/product-details/:product_id" element={<ProductDetail />} />
      <Route path="/carts" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/failed" element={<CheckoutFailed />} />

    </Routes>
  );
}
