import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://foodiebackend-1-ef18.onrender.com/api/blogposts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`https://foodiebackend-1-ef18.onrender.com/api/blogposts/${id}`);
      toast.success("Post deleted successfully");
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts found</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Blog Posts</h2>
        <button
          onClick={() => navigate("/admin/blog/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        > Add New Post</button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Slug</th>
            {/* <th className="border border-gray-300 p-2 w-64">Content</th> */}
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{post.title}</td>
              <td className="border border-gray-300 p-2">{post.slug}</td>
              {/* <td
                className="border border-gray-300 p-2 w-64 overflow-hidden text-ellipsis line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              /> */}
              <td className="border border-gray-300 p-2">
                {post.category?.name || post.category || "Unknown"}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {post.image ? (
                  <img
                    src={`http://localhost:5000${post.image}`}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => navigate(`/admin/edit-blog/${post._id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
