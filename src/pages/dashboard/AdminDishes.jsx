import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDishes() {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({ title: "", img: null, price: "", day: "" });
  const [editingDishId, setEditingDishId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all dishes
  const fetchDishes = async () => {
    try {
      const res = await axios.get("https://foodiebackend-ru76.onrender.com/api/dishes");
      setDishes(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dishes!");
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  // Drag & Drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
        toast.error("Only PNG, JPG, JPEG, WEBP files allowed!");
        return;
      }
      setNewDish({ ...newDish, img: file });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Add or update dish
  const addOrUpdateDish = async () => {
    if (!newDish.title || !newDish.price || !newDish.day) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newDish.title);
    formData.append("price", newDish.price);
    formData.append("day", newDish.day);
    if (newDish.img) formData.append("img", newDish.img);

    try {
      setLoading(true);
      if (editingDishId) {
        await axios.put(`https://foodiebackend-1-ef18.onrender.com/api/dishes/${editingDishId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Dish updated successfully!");
      } else {
        if (!newDish.img) {
          toast.error("Image is required for new dish!");
          setLoading(false);
          return;
        }
        await axios.post("https://foodiebackend-1-ef18.onrender.com/api/dishes", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Dish added successfully!");
      }
      setNewDish({ title: "", img: null, price: "", day: "" });
      setEditingDishId(null);
      fetchDishes();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const editDish = (dish) => {
    setNewDish({
      title: dish.title,
      img: null, // keep null, only updated if user uploads new image
      price: dish.price.toString(),
      day: dish.day,
    });
    setEditingDishId(dish._id);
  };

  const deleteDish = async (dishId) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await axios.delete(`https://foodiebackend-1-ef18.onrender.com/api/dishes/${dishId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Dish deleted successfully!");
      fetchDishes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete dish!");
    }
  };

  return (
    <div className="p-5">
      <Toaster position="bottom-right" reverseOrder={false} />
      <h1 className="text-2xl font-semibold mb-5">Manage Dishes</h1>

      {/* Add/Edit Dish Form */}
      <div className="grid grid-cols-5 gap-4 mb-5 text-sm">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Title"
          value={newDish.title}
          onChange={(e) => setNewDish({ ...newDish, title: e.target.value })}
        />

        {/* Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative border border-dashed border-gray-400 px-3 py-2 rounded flex items-center justify-center text-center cursor-pointer"
        >
          {newDish.img ? (
            <span className="pointer-events-none">{newDish.img.name}</span>
          ) : editingDishId && dishes.find((d) => d._id === editingDishId)?.img ? (
            <img
              src={dishes.find((d) => d._id === editingDishId)?.img}
              alt="Current dish"
              className="w-16 h-16 object-cover mx-auto rounded pointer-events-none"
            />
          ) : (
            <span className="pointer-events-none">Drag & Drop Image Here</span>
          )}

          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
                  toast.error("Only PNG, JPG, JPEG, WEBP files allowed!");
                  return;
                }
                setNewDish({ ...newDish, img: file });
              }
            }}
          />
        </div>

        <input
          className="border px-3 py-2 rounded"
          type="number"
          placeholder="Price"
          value={newDish.price}
          onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
        />

        <select
          className="border px-3 py-2 rounded"
          value={newDish.day}
          onChange={(e) => setNewDish({ ...newDish, day: e.target.value })}
        >
          <option value="">Select Day</option>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day) => (
              <option key={day} value={day}>
                {day}
              </option>
            )
          )}
        </select>

        <button
          onClick={addOrUpdateDish}
          disabled={loading}
          className={`${
            editingDishId ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-3 py-2 rounded transition`}
        >
          {editingDishId ? (loading ? "Updating..." : "Update") : loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Dishes Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200 text-center">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="border p-2">Title</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Day</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-center">
            {dishes.map((dish) => (
              <tr key={dish._id}>
                <td className="border p-2">{dish.title}</td>
                <td className="border p-2">
                  {dish.img ? (
                    <img
                      src={dish.img}
                      alt={dish.title}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="border p-2">${dish.price}</td>
                <td className="border p-2">{dish.day}</td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => editDish(dish)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteDish(dish._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
