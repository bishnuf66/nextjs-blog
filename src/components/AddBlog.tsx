import React, { useState } from "react";
import { createBlog } from "../services/blogService";
import { X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

interface AddBlogProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogAdded?: () => void;
}

const AddBlog: React.FC<AddBlogProps> = ({ isOpen, onClose, onBlogAdded }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null); // For image file
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    if (!imageFile) {
      toast.error("Blog image is required");
      return;
    }

    setIsSubmitting(true);

    // Convert the image file to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string; // Base64 string
      const createPayload = {
        title,
        description,
        imageUrl, // Store the base64 string as image URL
        email,
      };
      
      try {
        const newBlog = await createBlog(createPayload);
        toast.success("Blog created successfully!");
        resetForm();
        if (onBlogAdded) onBlogAdded();
        onClose();
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(imageFile); // Converts the file to a base64 string
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setEmail("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-7xl rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with colored strip */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Create a New Blog
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                Add a blog with all the details you need to track
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about this blog..."
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={3}
                />
              </div>

              {/* Image File Upload */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Create Blog"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddBlog;
