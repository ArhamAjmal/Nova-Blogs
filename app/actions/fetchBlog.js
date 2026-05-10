"use server";

import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";
import { getSessionUser, isOwnerOrAdmin } from "./../lib/auth";

const fetchBlog = async (slug) => {
  await dbConnect();
  const blog = await BlogModel.findOne({ slug });
  if (!blog) return { success: false, data: "blog not found" };

  if (blog.status !== "published") {
    const session = await getSessionUser();
    if (!isOwnerOrAdmin(session, blog)) {
      return { success: false, data: "blog not found" };
    }
  }

  return { success: true, data: JSON.parse(JSON.stringify(blog)) };
};

export default fetchBlog;
