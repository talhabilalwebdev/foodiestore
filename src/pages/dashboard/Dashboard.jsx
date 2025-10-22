import React, { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function Dashboard() {
  const [showToast, setShowToast] = useState(false);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    todayOrders: 0,
    pendingOrders: 0,
    monthSales: 0,
    monthOrders: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    // ✅ Load user info
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) setUserName(user.username);

    // ✅ Handle welcome toast
    if (localStorage.getItem("show_welcome_toast")) {
      setShowToast(true);
      localStorage.removeItem("show_welcome_toast");
    }

    // ✅ Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const res = await fetch("https://foodiebackend-1-ef18.onrender.com/api/dashboard-stats");
        const data = await res.json();
        console.log("Dashboard API Response:", data); // ✅ log API response
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Today's Revenue ($)", value: stats.todayRevenue },
    { label: "Today's Orders", value: stats.todayOrders },
    { label: "Pending Orders", value: stats.pendingOrders },  
    { label: "Total Users", value: stats.totalUsers },
    { label: "Active Accounts", value: stats.activeUsers },
    { label: "This Month's Sales ($)", value: stats.monthSales },
    { label: "This Month's Orders", value: stats.monthOrders },
  ];

  return (
    <div className="p-5">
      {showToast && (
        <Toast
          message="Welcome to Dashboard!"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
