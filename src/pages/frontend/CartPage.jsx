// src/pages/cart/CartPage.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, checkout, loading } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("You must log in to place an order!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Proceed to checkout page
    navigate("/checkout");
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      {/* Banner */}
      <div className="h-[50vh] flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="text-backgroundColor font-semibold text-6xl">Add to Cart</h1>
          <p className="text-backgroundColor">Select items and checkout securely.</p>
        </div>
      </div>

      <div className="w-full p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg px-5 pt-10 lg:px-32">
        <h2 className="text-3xl font-semibold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl text-gray-600">Your cart is empty</h2>
            <Link
              to="/"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p>${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(
                          item._id,
                          parseInt(e.target.value || "0", 10)
                        )
                      }
                      className="w-16 border px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right mt-6">
              <h3 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h3>

              {isLoggedIn ? (
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="mt-3 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  {loading ? "Processing..." : "Checkout"}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: "/cart" }}
                  className="inline-block mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Login to Checkout
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
