import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getUser } from "@/utils/auth"; // ✅ Make sure this returns { name, email, role }

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    customer: "",
    day: "",
    status: "",
    dateRange: "today",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef();

  const user = getUser(); // ✅ Logged-in user from localStorage or auth utils

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/orders");
      let allOrders = res.data;

      // ✅ If user is not admin → only show their orders
      if (user && user.role !== "admin") {
        allOrders = allOrders.filter(
          (order) => order.user_info?.email === user.email
        );
      }

      setOrders(allOrders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update/${id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/delete/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  };

  // ✅ FILTER DATE RANGE
  const isWithinDateRange = (orderDate, range) => {
    const today = new Date();
    const order = new Date(orderDate);
    if (isNaN(order.getTime())) return true;

    if (range === "today") return order.toDateString() === today.toDateString();
    if (range === "7days") {
      const past7 = new Date();
      past7.setDate(today.getDate() - 7);
      return order >= past7 && order <= today;
    }
    if (range === "30days") {
      const past30 = new Date();
      past30.setDate(today.getDate() - 30);
      return order >= past30 && order <= today;
    }
    if (range === "1year") {
      const pastYear = new Date();
      pastYear.setFullYear(today.getFullYear() - 1);
      return order >= pastYear && order <= today;
    }
    if (range === "custom") {
      if (!filters.startDate || !filters.endDate) return true;
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      return order >= start && order <= end;
    }
    return true;
  };

  // ✅ FILTER ORDERS
  const filteredOrders = orders.filter((order) => {
    const name = order?.user_info?.name?.toLowerCase() || "";
    const status = order?.status?.toLowerCase() || "";
    const day = order?.items?.[0]?.day || "";
    return (
      (filters.customer === "" ||
        name.includes(filters.customer.toLowerCase())) &&
      (filters.day === "" || day === filters.day) &&
      (filters.status === "" || status === filters.status.toLowerCase()) &&
      (filters.dateRange === "" ||
        isWithinDateRange(order.created_at?.$date, filters.dateRange))
    );
  });

  // ✅ EXPORT FUNCTIONS
  const getFormattedOrders = () =>
    filteredOrders.map((order) => ({
      "Order ID": order._id.slice(-6),
      Customer: order.user_info?.name || "",
      Email: order.user_info?.email || "",
      Phone: order.user_info?.phone || "",
      Address: order.user_info?.address || "",
      Items: order.items
        .map((i) => `${i.title} × ${i.quantity} ($${i.price})`)
        .join(" | "),
      Total: order.total || 0,
      Status: order.status || "",
      Date: order.created_at?.$date
        ? new Date(order.created_at.$date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    }));

  const exportToCSV = () => {
    if (!filteredOrders.length) return alert("No orders to export");
    const headers = Object.keys(getFormattedOrders()[0]).join(",");
    const rows = getFormattedOrders()
      .map((row) => Object.values(row).map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([headers + "\n" + rows], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "orders.csv");
  };

  const exportToExcel = () => {
    if (!filteredOrders.length) return alert("No orders to export");
    const ws = XLSX.utils.json_to_sheet(getFormattedOrders());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "orders.xlsx"
    );
  };

  const exportToPDF = () => {
    if (!filteredOrders.length) return alert("No orders to export");
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(14);
    doc.text("Orders Report", 14, 15);

    autoTable(doc, {
      head: [Object.keys(getFormattedOrders()[0])],
      body: getFormattedOrders().map((o) => Object.values(o)),
      startY: 25,
      styles: { fontSize: 9, overflow: "linebreak", cellWidth: "auto" },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      columnStyles: { 4: { cellWidth: 50 }, 5: { cellWidth: 80 } },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save("orders.pdf");
  };

  // ✅ LOADING
  if (loading)
    return <div className="text-center mt-10 text-lg">Loading orders...</div>;

  // ✅ UI
  return (
    <div className="p-5">
      <Toaster position="bottom-right" />
      <h1 className="text-2xl font-semibold mb-5">
        {user?.role === "admin" ? "All Orders" : "My Orders"}
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-5 text-sm">
        <input
          type="text"
          name="customer"
          placeholder="Filter by Customer"
          value={filters.customer}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <select
          name="day"
          value={filters.day}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Days</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          name="dateRange"
          value={filters.dateRange}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="1year">Last 1 Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {filters.dateRange === "custom" && (
          <div className="flex gap-2 col-span-2">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        )}

        {/* Export Button */}
        <div ref={exportRef} className="relative col-span-1">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="btn btn-outline-primary px-4 py-2 rounded w-full text-sm"
          >
            Export ▼
          </button>
          {exportOpen && (
            <div className="absolute mt-1 bg-white border rounded shadow-md w-full z-50">
              <button
                className="block w-full px-3 py-2 hover:bg-gray-100 text-left"
                onClick={() => {
                  exportToCSV();
                  setExportOpen(false);
                }}
              >
                CSV
              </button>
              <button
                className="block w-full px-3 py-2 hover:bg-gray-100 text-left"
                onClick={() => {
                  exportToExcel();
                  setExportOpen(false);
                }}
              >
                Excel
              </button>
              <button
                className="block w-full px-3 py-2 hover:bg-gray-100 text-left"
                onClick={() => {
                  exportToPDF();
                  setExportOpen(false);
                }}
              >
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Items</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-4 text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4">{order._id.slice(-6)}</td>
                <td className="py-2 px-4">{order.user_info.name}</td>
                <td className="py-2 px-4">{order.user_info.email}</td>
                <td className="py-2 px-4">{order.user_info.phone}</td>
                <td className="py-2 px-4">{order.user_info.address}</td>
                <td className="py-2 px-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span>
                        {item.title} × {item.quantity} (${item.price})
                      </span>
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4">${order.total}</td>
                <td className="py-2 px-4">
                  {user?.role === "admin" ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className="text-gray-700">{order.status}</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  {new Date(order.created_at.$date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-2 px-4 text-center">
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersAdmin;
