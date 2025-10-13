// src/pages/frontend/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  // Redirect if not logged in or cart empty (only on mount)
  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
    } else if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user details from backend
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setFormData({
            username: data.user.username || "",
            email: data.user.email || "",
            address: data.user.address || "",
            phone: data.user.phone || "",
            notes: "",
          });
        } else {
          toast.error(data.error || "Failed to fetch user data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, token]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutInProgress(true);

    if (!formData.username || !formData.address || !formData.phone) {
      toast.error("Please fill all required fields!");
      setCheckoutInProgress(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          user_info: formData,
          items: cart,
          total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/thankyou", {
          state: { orderId: data.order_id, total },
        });
      } else {
        toast.error(data.error || "Checkout failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during checkout");
    } finally {
      setCheckoutInProgress(false);
    }
  };

  if (loading) return <p className="text-center py-20">Loading user info...</p>;

  return (
    <div className="px-5 lg:px-32 py-10">
      <h2 className="text-3xl font-semibold mb-6">Checkout</h2>

      <form
        onSubmit={handleCheckout}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left - User Info */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="bg-gray-50 p-5 rounded-lg shadow space-y-4">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border-b pb-2"
            >
              <p>
                {item.title} × {item.quantity}
              </p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div className="flex justify-between text-lg font-semibold pt-3">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={checkoutInProgress}
            className={`w-full mt-4 py-2 rounded text-white ${
              checkoutInProgress
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {checkoutInProgress ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
