// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import { Toaster } from "react-hot-toast";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public pages
import Home from "./pages/frontend/Home";
import AboutUs from "./pages/frontend/AboutUs";
import Blogs from "./pages/frontend/Blogs";
import CartPage from "./pages/frontend/CartPage";
import CheckoutPage from "./pages/frontend/CheckoutPage";
import ThankYouPage from "./pages/frontend/ThankYouPage";
import Menu from "./pages/frontend/Menu";
import Dishes from "./components/Dishes";
import Review from "./components/Review";

// Admin pages
import Dashboard from "./pages/dashboard/Dashboard";
import AdminDishes from "./pages/dashboard/AdminDishes";
import Orders from "./pages/dashboard/Orders";
import Customers from "./pages/dashboard/Customers";
import MyProfilePage from "./pages/dashboard/MyProfilePage";
import BlogCategories from "./pages/dashboard/BlogCategories";
import AddBlog from "./pages/dashboard/AddBlog";
import PostsList from "./pages/dashboard/PostsList";
import EditBlog from "./pages/dashboard/EditBlog";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import TrackOrderPage from "./pages/frontend/TrackOrderPage";
import SingleBlog from "./pages/frontend/SingleBlog";
import NextBuses from "./pages/frontend/NextBuses";

// Hook to sync logout across tabs
function StorageSync() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return null;
}

const App = () => {
  return (
    <Router>
      <StorageSync />

      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<SingleBlog />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/trackorder" element={<TrackOrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/next-buses" element={<NextBuses />} /> {/* 👈 New Route */}

        </Route>

        {/* Auth pages */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        {/* Admin protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="customers" element={<Customers />} />

          {/* Dishes */}
          <Route path="dishes" element={<AdminDishes />} />

          {/* Blog */}
          <Route path="blog-categories" element={<BlogCategories />} />
          <Route path="blogs" element={<PostsList />} />
          <Route path="blog/add" element={<AddBlog />} />
          <Route path="edit-blog/:id" element={<EditBlog />} /> {/* ✅ fixed path */}
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard / Profile */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<MyProfilePage />} />

          {/* Orders / Customers */}
          <Route path="orders" element={<Orders />} />
        </Route>

      </Routes>


      <Toaster position="bottom-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
