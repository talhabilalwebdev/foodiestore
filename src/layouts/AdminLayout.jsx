// src/layouts/AdminLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { removeToken, getUser, getToken } from "@/utils/auth";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = getToken();
  const user = getUser();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  // close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // handle Escape key for sidebar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        id="sidebar"
        role="navigation"
        aria-hidden={!isOpen}
        className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-800 text-white p-5 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="text-white text-2xl"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {user?.role === "admin" ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Customers
              </NavLink>

              <NavLink
                to="/admin/dishes"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Dishes
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/admin/blog-categories"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Blog Categories
              </NavLink>

              <NavLink
                to="/admin/blogs"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Blogs
              </NavLink>

              <NavLink
                to="/admin/profile"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                My Orders
              </NavLink>

              <NavLink
                to="/admin/profile"
                className={({ isActive }) =>
                  `px-2 py-1 rounded ${isActive ? "text-yellow-400" : "hover:text-yellow-300"
                  }`
                }
              >
                Profile
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center relative">
          <button
            onClick={() => setIsOpen((s) => !s)}
            aria-expanded={isOpen}
            aria-controls="sidebar"
            className="text-white text-2xl"
          >
            ☰
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
            >
              <FiUser className="text-xl" />
              <span>{user?.name || "Account"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg border">
                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                >
                  <FiUser />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-5 md:p-10 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
        <footer className="bg-gray-800 text-white p-4 justify-between items-center">
          <p className="text-center text-500">
            © 2025 Foodie Store. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
