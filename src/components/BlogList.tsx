"use client";

import React, { useState, useEffect } from "react";
import { fetchBlogs } from "../services/blogService"; // Import the fetchBlogs function from blogService
import { Search } from "lucide-react"; // Importing search icon

interface Blog {
  id: number; // Using number for blog ID as it is generated with Date.now()
  title: string;
  description: string;
  imageUrl: string; // Base64 string for image
  date: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch blogs from localStorage using fetchBlogs function
  useEffect(() => {
    const loadBlogs = () => {
      try {
        const blogs = fetchBlogs(); // Get blogs from localStorage
        setBlogs(blogs); // Update the state with fetched blogs
      } catch (error) {
        console.error("Error loading blogs", error);
      } finally {
        setLoading(false); // Stop loading once the blogs are fetched
      }
    };

    loadBlogs();
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No blogs found</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 transition-all duration-200 hover:shadow-md"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{blog.description}</p>
                <div className="flex mt-4 text-xs text-gray-500">
                  <span className="px-2 py-1 rounded-full text-xs">
                    {blog.date}
                  </span>
                </div>
                {/* Displaying image */}
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="mt-4 rounded-lg w-full max-h-48 object-contain"
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

export default BlogList;
