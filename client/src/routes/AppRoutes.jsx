import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Receipt from "../pages/Receipt";
import MyOrders from "../pages/MyOrders";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import Clients from "../pages/admin/Clients";
import AdminProducts from "../pages/admin/Products";
import NewProduct from "../pages/admin/NewProduct";
import EditProduct from "../pages/admin/EditProduct";
import Categories from "../pages/admin/Categories";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receipt/:id"
        element={
          <ProtectedRoute>
            <Receipt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="clients" element={<Clients />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<NewProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="categories" element={<Categories />} />
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
    </Routes>
  );
}