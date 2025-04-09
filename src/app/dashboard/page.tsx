"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { fetchBlogs, deleteBlog } from "../../services/blogService";
import { Search } from "lucide-react";
import AddBlog from "@/components/AddBlog";
import { toast } from "react-hot-toast"; // Consider adding toast notifications

interface Blog {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const BlogDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editBlogData, setEditBlogData] = useState<Blog | null>(null);

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // Load blogs with proper async/await
  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const blogs = await fetchBlogs(); // Assuming this is async
      setBlogs(blogs);
    } catch (err) {
      console.error("Error loading blogs", err);
      setError("Failed to load blogs. Please try again.");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await deleteBlog(id.toString());
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      toast.success(response.message || "Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog", error);
      toast.error("Failed to delete blog");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditBlogData(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
        <button
          onClick={loadBlogs}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Dashboard</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
          onClick={() => {
            setEditBlogData(null);
            setIsModalOpen(true);
          }}
        >
          Add Blog
        </button>
      </div>

      <AddBlog
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editBlogData={editBlogData}
        onBlogAdded={loadBlogs} // Simplified refresh
      />

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No matching blogs found" : "No blogs available"}
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 transition-all duration-200 hover:shadow-md"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{blog.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 text-sm"
                      onClick={() => {
                        setEditBlogData(blog);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-400 text-sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{blog.description}</p>
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="mt-4 rounded-lg w-full max-h-48 object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogDashboard;
