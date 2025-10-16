import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";

export default function AddPost() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    image: null,
    content: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch categories dynamically
  useEffect(() => {
    axios
      .get("https://foodiebackend-1-ef18.onrender.com/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation — all fields required
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.slug.trim()) return toast.error("Slug is required");
    if (!formData.category.trim()) return toast.error("Category is required");
    if (!formData.image) return toast.error("Image is required");
    if (!formData.content.trim()) return toast.error("Content is required");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token missing! Please login again.");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("slug", formData.slug);
    form.append("category", formData.category);
    form.append("image", formData.image);
    form.append("content", formData.content);

    try {
      setLoading(true);
      const res = await axios.post("https://foodiebackend-1-ef18.onrender.com/api/blog-posts", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      redirect("/admin/blogs");
      toast.success("Post added successfully!");
      setFormData({ title: "", category: "", image: null, content: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Drag & drop handler for image
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setFormData({ ...formData, image: file });
    } else {
      toast.error("Only PNG, JPG, JPEG, WEBP files allowed!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Blog Post</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Enter post title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Slug */}

        <div>
          <label className="block font-semibold mb-1">Slug *</label>
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Enter post Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category *</label>
          <select
            className="border px-3 py-2 rounded w-full"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        </div>

        {/* Image Upload */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border border-dashed border-gray-400 px-3 py-6 rounded flex items-center justify-center text-center cursor-pointer"
        >
          {formData.image ? (
            <span className="pointer-events-none text-gray-600">
              {formData.image.name}
            </span>
          ) : (
            <span className="pointer-events-none text-gray-400">
              Drag & Drop Image Here or Click to Upload
            </span>
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
                setFormData({ ...formData, image: file });
              }
            }}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold mb-1">Content *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="h-[200px] mb-10 bg-white"
            placeholder="Write your post content..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Submitting..." : "Add Post"}
        </button>
      </form>
    </div>
  );
}
