import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { authFetch } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("https://foodiebackend-ru76.onrender.com/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name required");

    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `https://foodiebackend-ru76.onrender.com/api/categories/${editingId}`
        : "https://foodiebackend-ru76.onrender.com/api/categories";

      const res = await authFetch(url, {
        method,
        body: JSON.stringify({ name }),
      });

      toast.success(editingId ? "Category updated" : "Category added");
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await authFetch(`https://foodiebackend-ru76.onrender.com/api/categories/${id}`, {
        method: "DELETE",
      });
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-5">Manage Blog Categories</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <Input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update" : "Add"}
        </Button>
        {editingId && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
          >
            Cancel
          </Button>
        )}
      </form>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Category Name</th>
            <th className="p-2 border">Slug</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, i) => (
              <tr key={cat._id} className="border-b">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border text-gray-500">{cat.slug}</td>
                <td className="p-2 border text-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No categories yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
