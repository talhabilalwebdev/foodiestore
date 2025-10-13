// src/pages/order/ThankYouPage.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      toast.error("No order found!");
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-5">
      <Toaster position="bottom-right" />
      <div className="bg-white shadow-lg p-10 rounded-2xl max-w-lg">
        <img
          src="https://img.freepik.com/free-vector/thank-you-lettering_1262-6963.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Thank You"
          className="w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-3xl font-semibold text-green-600 mb-2">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is now
          being processed.
        </p>

        <div className="text-left bg-gray-50 p-4 rounded mb-6">
          <p className="font-semibold text-gray-700 mb-1">
            Order ID: <span className="font-normal">{orderId}</span>
          </p>
          <p className="font-semibold text-gray-700 mb-1">
            Total Amount: <span className="font-normal">${total?.toFixed(2)}</span>
          </p>
          <p className="font-semibold text-gray-700">
            Status: <span className="font-normal text-green-600">Processing</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
           
          <button
            onClick={() => navigate("/menu")}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
