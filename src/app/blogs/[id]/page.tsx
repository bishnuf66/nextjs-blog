"use client";

import SingleBlog from "@/components/SingleBlog";
import { useParams } from "next/navigation";

export default function BlogPage() {
  const params = useParams();
  const id = params.id as string;
  return <SingleBlog blogId={id} />;
}
