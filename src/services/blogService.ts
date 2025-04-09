// blogService.ts

// Updated BlogCreatePayload without id and date
interface BlogCreatePayload {
  title: string;
  description: string;
  imageUrl: string; // base64 image string
}

interface BlogUpdatePayload {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  date?: string;
}

// Fetch all blogs from localStorage
export const fetchBlogs = () => {
  try {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs from localStorage", error);
    throw error;
  }
};

// Create a new blog and store it in localStorage
export const createBlog = ({
  title,
  description,
  imageUrl,
}: BlogCreatePayload) => {
  try {
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");

    const newBlog = {
      id: Date.now(), // Unique ID
      title,
      description,
      imageUrl,
      date: new Date().toISOString(), // ISO date string
    };

    blogs.push(newBlog);
    localStorage.setItem("blogs", JSON.stringify(blogs));

    return newBlog;
  } catch (error) {
    console.error("Error creating blog in localStorage", error);
    throw error;
  }
};

// Update a blog in localStorage
export const updateBlog = (blogId: string, updatedFields: BlogUpdatePayload) => {
  try {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const blogIndex = blogs.findIndex((blog: any) => blog.id === parseInt(blogId));

    if (blogIndex === -1) {
      throw new Error("Blog not found");
    }

    const updatedBlog = { ...blogs[blogIndex], ...updatedFields };

    blogs[blogIndex] = updatedBlog;
    localStorage.setItem('blogs', JSON.stringify(blogs));

    return updatedBlog;
  } catch (error) {
    console.error("Error updating blog in localStorage", error);
    throw error;
  }
};

// Delete a blog from localStorage
export const deleteBlog = (blogId: string) => {
  try {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const updatedBlogs = blogs.filter((blog: any) => blog.id !== parseInt(blogId));

    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));

    return { message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog from localStorage", error);
    throw error;
  }
};
