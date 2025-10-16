import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "",
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://foodiebackend-1-ef18.onrender.com/api/customers");
      setCustomers(response.data);
    } catch (error) {
      toast.error("Failed to fetch customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`https://foodiebackend-1-ef18.onrender.com/api/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  // Edit inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited customer
  const handleSaveEdit = async () => {
    try {
      const { _id, name, email, address, status } = editCustomer;
      await axios.put(`https://foodiebackend-1-ef18.onrender.com/api/customers/${_id}`, {
        name,
        email,
        address,
        status,
      });
      setCustomers((prev) =>
        prev.map((c) => (c._id === _id ? { ...c, ...editCustomer } : c))
      );
      setEditCustomer(null);
      toast.success("Customer updated successfully");
    } catch (error) {
      toast.error("Failed to update customer");
    }
  };

  // Apply filters
  const filteredCustomers = customers.filter((customer) => {
    return (
      (filters.name === "" ||
        customer.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.email === "" ||
        customer.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.status === "" || customer.status === filters.status)
    );
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading customers...
      </div>
    );

  return (
    <div className="p-5">
      <Toaster position="bottom-right" />
      <h1 className="text-2xl font-semibold mb-5">Customers</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Joined Date</th>
              <th className="py-2 px-4">Total Orders</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, idx) => (
                <tr
                  key={customer._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                >
                  <td className="py-2 px-4">{customer._id.slice(-6)}</td>
                  <td className="py-2 px-4">
                    {editCustomer?._id === customer._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editCustomer.name}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      customer.name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editCustomer?._id === customer._id ? (
                      <input
                        type="text"
                        name="email"
                        value={editCustomer.email}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      customer.email
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editCustomer?._id === customer._id ? (
                      <input
                        type="text"
                        name="address"
                        value={editCustomer.address || ""}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      customer.address || "-"
                    )}
                  </td>
                  <td className="py-2 px-4">{customer.joinedDate}</td>
                  <td className="py-2 px-4">{customer.totalOrders}</td>
                  <td className="py-2 px-4">
                    {editCustomer?._id === customer._id ? (
                      <select
                        name="status"
                        value={editCustomer.status}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                          customer.status === "active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {customer.status}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    {editCustomer?._id === customer._id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          💾
                        </button>
                        <button
                          onClick={() => setEditCustomer(null)}
                          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditCustomer(customer)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500 font-medium">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
