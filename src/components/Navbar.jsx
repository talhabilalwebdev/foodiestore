import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiRestaurant, BiChevronDown } from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import Button from "../layouts/Button";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleChange = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Update login status if localStorage changes (e.g., login/logout in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="sticky w-full">
      <div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        {/* Logo */}
        <div className="flex flex-row items-center cursor-pointer">
          <BiRestaurant size={32} />
          <Link to="/" className="hover:text-brightColor transition-all text-xl font-semibold ml-2">
            Foodie Store
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex flex-row items-center text-lg font-medium gap-8">
          <Link to="/" className="hover:text-brightColor transition-all">Home</Link>
          <Link to="/about-us" className="hover:text-brightColor transition-all">About</Link>
          <Link to="/blogs" className="hover:text-brightColor transition-all">Blogs</Link>
          {isHome ? (
            <a href="#menu" className="hover:text-brightColor transition-all">Menu</a>
          ) : (
            <Link to="/#menu" className="hover:text-brightColor transition-all">Menu</Link>
          )}
          <Link to="/cart" className="hover:text-brightColor transition-all">Cart</Link>

          {/* Role-based buttons */}
          {isLoggedIn ? (
            <Button title="Dashboard" to="/admin/dashboard" />
          ) : (
            <>
              <Button title="Login" to="/login" />
              <Button title="Register" to="/register" />
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          {menu ? (
            <AiOutlineClose size={25} onClick={handleChange} />
          ) : (
            <AiOutlineMenuUnfold size={25} onClick={handleChange} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${menu ? "translate-x-0" : "-translate-x-full"} lg:hidden flex flex-col absolute bg-black text-white left-0 top-20 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
      >
        <Link to="/" onClick={closeMenu} className="hover:text-brightColor transition-all">Home</Link>
        <Link to="/about-us" onClick={closeMenu} className="hover:text-brightColor transition-all">About</Link>
        <Link to="/blogs" onClick={closeMenu} className="hover:text-brightColor transition-all">Blogs</Link>
        <Link to="/menu" onClick={closeMenu} className="hover:text-brightColor transition-all">Menu</Link>
        <Link to="/reviews" onClick={closeMenu} className="hover:text-brightColor transition-all">Reviews</Link>

        {/* Role-based buttons */}
        {isLoggedIn ? (
          <Button title="Dashboard" to="/admin/dashboard" />
        ) : (
          <>
            <Button title="Login" to="/login" />
            <Button title="Register" to="/register" />
          </>
        )}
      </div>

      {/* Floating Cart Icon */}
      <Link
        to="/cart"
        className="fixed bottom-6 right-6 bg-brightColor text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <ShoppingCart size={24} />
      </Link>
    </div>
  );
};

export default Navbar;
