import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../layouts/Button";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ New state: Start in loading mode
  const limit = 12;

  const fetchBlogs = async (page) => {
    setLoading(true); // Set loading to true at the start of fetch
    try {
      const res = await axios.get(`http://localhost:5000/api/blogpost?page=${page}&limit=${limit}`);
      // console.log("API Response Data:", res.posts);

      // The API returns an object {posts: [...], totalPages: ...}
      // Ensure we safely handle a potentially missing 'posts' array
      setBlogs(res.data.posts || []);

      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
      // Set to empty array on failure to ensure 'blogs' is always an array
      setBlogs([]);
    } finally {
      setLoading(false); // Set loading to false when the fetch is complete (success or failure)
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  return (
    <div>
      <div className="h-[50vh] flex items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
        <div className="w-full lg:w-2/3 space-y-5 text-left">
          <h1 className="text-backgroundColor font-semibold text-6xl">
            Our Blogs
          </h1>
        </div>
      </div>

      <div className="min-h-screen px-5 lg:px-32 py-10">
        {/* ✅ FIX: Use the loading state to control the render flow */}
        {loading ? (
          <p className="text-center text-xl text-blue-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          // This is only shown if not loading AND the array is empty
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
             
              <div key={blog._id} className="border rounded-md overflow-hidden shadow-md hover:shadow-xl transition">
                 <Link to={`/blogs/${blog.slug}`}>
                {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold text-md mb-2">{blog.title}</h3>
                  <div className="mt-3 flex justify-start">
                    <Button className="" title="Read More" to={`/blogs/${blog.slug}`} />
                  </div>
                </div>
                
              </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination is only rendered if not loading AND there are posts to paginate */}
        {!loading && blogs.length > 0 && (
          <div className="flex justify-center mt-10 gap-3">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200 rounded">
              {page} / {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}