import React, { useEffect, useState } from "react";
import { getToken, getUser } from "@/utils/auth";
import { toast } from "react-hot-toast";

export default function MyProfilePage() {
  const token = getToken();
  const user = getUser();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://foodiebackend-ru76.onrender.com/api/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setFormData({
            username: data.user.username || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
          });
        } else {
          toast.error(data.error || "Failed to fetch user info");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching user info");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Only call once on mount if user exists
    if (user?.id && token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []); // ✅ empty dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`https://foodiebackend-ru76.onrender.com/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Edit Profile
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
