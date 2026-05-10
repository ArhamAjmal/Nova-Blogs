"use server";

import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";
import { requireUser, isOwnerOrAdmin } from "../lib/auth";

const trimStrings = (obj) => {
  const out = {};
  for (const key in obj) {
    out[key] = typeof obj[key] === "string" ? obj[key].trim() : obj[key];
  }
  return out;
};

const computeReadingTime = (markdown) => {
  const words = (markdown || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const editBlog = async (data) => {
  let session;
  try {
    session = await requireUser();
  } catch {
    return { success: false, data: "You must be signed in to edit." };
  }
  await dbConnect();

  const clean = trimStrings(data);
  const slug = clean.slug;

  const existing = await BlogModel.findOne({ slug, authorId: session.clerkId });
  if (!existing) {
    const anyMatch = await BlogModel.findOne({ slug });
    if (anyMatch && !isOwnerOrAdmin(session, anyMatch)) {
      return { success: false, data: "You do not own this blog." };
    }
    return { success: false, data: "Slug does not exist." };
  }

  const status = clean.status === "published" ? "published" : "draft";
  const update = {
    ...clean,
    status,
    readingTime: computeReadingTime(clean.description),
    publishedAt:
      status === "published" && !existing.publishedAt
        ? new Date()
        : existing.publishedAt,
  };
  delete update.authorId;
  delete update.authorUsername;

  const result = await BlogModel.updateOne(
    { _id: existing._id },
    { $set: update }
  );
  return { success: true, data: JSON.parse(JSON.stringify(result)) };
};

export default editBlog;
