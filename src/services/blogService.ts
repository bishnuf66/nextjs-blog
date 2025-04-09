
interface BlogCreatePayload {
  title: string;
  description: string;
  imageUrl: string; // base64 image string
}

interface BlogUpdatePayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  date?: string;
}

const sampleBlogs = [
  {
    id: Date.now(),
    title: "Getting Started with Next.js",
    description: "Next.js is a React framework that enables server-side rendering and generating static websites for React based web applications. It's a great tool for building modern web applications with React.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    date: new Date().toISOString()
  },
  {
    id: Date.now() + 1,
    title: "The Power of TypeScript",
    description: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It helps catch errors early and provides better code documentation.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    date: new Date().toISOString()
  },
  {
    id: Date.now() + 2,
    title: "Modern CSS Techniques",
    description: "CSS has evolved significantly over the years. Learn about modern CSS techniques like Grid, Flexbox, and CSS Custom Properties that make styling more powerful and maintainable.",
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    date: new Date().toISOString()
  },
  {
    id: Date.now() + 3,
    title: "Building Responsive Web Design",
    description: "Responsive web design is crucial in today's multi-device world. Learn how to create websites that look great on all devices, from mobile phones to desktop computers.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80",
    date: new Date().toISOString()
  },
  {
    id: Date.now() + 4,
    title: "State Management in React",
    description: "Understanding state management is crucial for building complex React applications. Explore different state management solutions and learn when to use each one.",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    date: new Date().toISOString()
  }
];

const initializeBlogs = () => {
  try {
    const existingBlogs = localStorage.getItem('blogs');
    if (!existingBlogs) {
      localStorage.setItem('blogs', JSON.stringify(sampleBlogs));
      return sampleBlogs;
    }
    return JSON.parse(existingBlogs);
  } catch (error) {
    console.error("Error initializing blogs", error);
    return [];
  }
};

// Fetch all blogs from localStorage
export const fetchBlogs = () => {
  try {
    const blogs = initializeBlogs();
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
      id: Date.now(),
      title,
      description,
      imageUrl,
      date: new Date().toISOString(), 
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
export const updateBlog = (blogId: number, updatedFields: BlogUpdatePayload) => {
  try {
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const blogIndex = blogs.findIndex((blog: any) => blog.id === blogId);

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
