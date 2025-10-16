import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      toast.error("Please enter your order number");
      return;
    }

    setLoading(true);
    setOrder(null);

    try {
      const res = await fetch(`https://foodiebackend-1-ef18.onrender.com/api/orders/${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
        toast.success("Order found!");
      } else {
        toast.error(data.error || "Order not found");
      }
    } catch (err) {
      console.error("Track order error:", err);
      toast.error("Server error while fetching order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[50vh] flex flex-row justify-center items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
        <div className="w-full lg:w-2/3 text-center">
          <h1 className="text-backgroundColor font-semibold text-6xl">
            Track Your Order
          </h1>
          <p className="text-backgroundColor mt-4 text-lg">
            Enter your Order ID to check the status of your order.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="w-full p-5 lg:px-32 mt-10">
        <form
          onSubmit={handleTrackOrder}
          className="max-w-md mx-auto flex flex-col items-center gap-4"
        >
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-medium"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>
      </div>

      {/* Order Details */}
      {order && (
        <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* --- Order + Items Card --- */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-green-700">
              Order Summary
            </h3>

            {/* Order Info */}
            <div className="flex flex-col gap-2 mb-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <p>
                  <strong>Order #:</strong> {orderId}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "completed"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> ${order.total}
                </p>
              </div>
            </div>

            {/* Items List */}
            <h4 className="text-xl font-semibold mt-2 mb-2">Items</h4>
            <ul className="space-y-3">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white p-3 rounded shadow-sm border"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Customer Details Card --- */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-blue-700">
              Customer Details
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
                <p className="font-medium">Name</p>
                <p>{order.user_info.username}</p>
              </li>
              <li className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
                <p className="font-medium">Email</p>
                <p>{order.user_info.email}</p>
              </li>
              <li className="flex items-center justify-between bg-white p-3 rounded shadow-sm border">
                <p className="font-medium">Phone</p>
                <p>{order.user_info.phone}</p>
              </li>
              <li className="flex items-start justify-between bg-white p-3 rounded shadow-sm border">
                <p className="font-medium">Address</p>
                <p className="text-right w-2/3">{order.user_info.address}</p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
