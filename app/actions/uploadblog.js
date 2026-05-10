"use server";

import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";
import { requireUser } from "../lib/auth";

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

const buildExcerpt = (markdown) => {
  const stripped = (markdown || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.slice(0, 200);
};

const uploadBlog = async (data) => {
  let session;
  try {
    session = await requireUser();
  } catch {
    return { success: false, data: "You must be signed in to publish." };
  }
  await dbConnect();

  const clean = trimStrings(data);
  const slug = clean.slug;

  const collision = await BlogModel.findOne({ slug });
  if (collision) return { success: false, data: "Slug already taken. Try a different one." };

  const status = clean.status === "published" ? "published" : "draft";
  const doc = new BlogModel({
    ...clean,
    status,
    publishedAt: status === "published" ? new Date() : null,
    excerpt: clean.excerpt || buildExcerpt(clean.description),
    readingTime: computeReadingTime(clean.description),
    authorId: session.clerkId,
    authorUsername: session.profile.username,
    authorName: session.profile.displayName || session.fullName,
    authorAvatar: session.profile.avatarUrl || session.imageUrl,
    author: clean.author || session.profile.displayName || session.fullName,
  });

  const saved = await doc.save();
  return { success: true, data: JSON.parse(JSON.stringify(saved)) };
};

export default uploadBlog;
