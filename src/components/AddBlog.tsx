import React, { useEffect, useState, useCallback } from "react";
import { createBlog, updateBlog } from "../services/blogService"; // Added updateBlog
import { X, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface BlogData {
  id?: number; // Changed from string to number to match service
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
}

interface AddBlogProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogAdded?: () => void;
  initialData?: BlogData | null;
}

const AddBlog: React.FC<AddBlogProps> = ({
  isOpen,
  onClose,
  onBlogAdded,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<Omit<BlogData, "id">>({
    title: "",
    description: "",
    imageUrl: "",
    date: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form when modal opens/closes or initialData changes
  const resetForm = useCallback(() => {
    setFormData({
      title: initialData?.title || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      date: initialData?.date || "",
    });
    setImageFile(null);
    setImagePreview(initialData?.imageUrl || null);
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the final image URL (either new upload or existing)
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        finalImageUrl = await convertImageToBase64(imageFile);
      }

      if (!finalImageUrl) {
        toast.error("Blog image is required");
        return;
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
      };

      if (initialData?.id) {
        // Update existing blog
        await updateBlog(initialData.id, payload);
        toast.success("Blog updated successfully!");
        onBlogAdded?.();
      } else {
        // Create new blog
        await createBlog(payload);
        toast.success("Blog created successfully!");
        onBlogAdded?.();
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white focus:outline-none"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {initialData ? "Edit Blog" : "Create a New Blog"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className="block w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add more details about this blog..."
              className="block w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {initialData ? "Update Image" : "Image Upload"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isSubmitting}
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 object-contain rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 border border-gray-300 text-sm font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                      />
                    </svg>
                  </span>
                  Processing...
                </>
              ) : initialData ? (
                "Update Blog"
              ) : (
                "Create Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
