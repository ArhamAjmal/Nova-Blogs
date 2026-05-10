"use server";

import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";
import { requireUser, isOwnerOrAdmin } from "../lib/auth";

export async function deleteBlog(slug) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return false;
  }
  await dbConnect();

  const blog = await BlogModel.findOne({ slug });
  if (!blog) return false;
  if (!isOwnerOrAdmin(session, blog)) return false;

  await BlogModel.deleteOne({ _id: blog._id });
  return true;
}
