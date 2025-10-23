import React, { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function Dashboard() {
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Load user info from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);

    // ✅ Handle welcome toast
    if (localStorage.getItem("show_welcome_toast")) {
      setShowToast(true);
      localStorage.removeItem("show_welcome_toast");
    }

    // ✅ Fetch dashboard statistics
    const fetchStats = async () => {
      if (!userData?.email) return;

      try {
        const res = await fetch(
          `https://foodiebackend-1-ef18.onrender.com/api/dashboard-stats?email=${userData.email}`
        );
        const data = await res.json();
        console.log("Dashboard API Response:", data); // ✅ Log API response
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-5 text-gray-500">Loading dashboard...</div>;
  }

  if (!stats || !stats.role) {
    return <div className="p-5 text-red-500">Unable to load dashboard data.</div>;
  }

  // ✅ Define dashboard cards based on role
  const adminCards = [
    { label: "Today's Revenue ($)", value: stats.todayRevenue },
    { label: "Today's Orders", value: stats.todayOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Total Users", value: stats.totalUsers },
    { label: "Active Accounts", value: stats.activeUsers },
    { label: "This Month's Sales ($)", value: stats.monthSales },
    { label: "This Month's Orders", value: stats.monthOrders },
  ];

  const userCards = [
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Today's Orders", value: stats.todayOrders },
    { label: "Total Spent ($)", value: stats.totalSpent },
  ];

  const cards = stats.role === "admin" ? adminCards : userCards;

  return (
    <div className="p-5">
      {showToast && (
        <Toast
          message={`Welcome back, ${user?.username || "User"}!`}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6 text-gray-600">
        {stats.role === "admin"
          ? "Here’s your admin overview."
          : "Here’s your personal order summary."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{card.value ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
