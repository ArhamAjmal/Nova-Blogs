"use server";

import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";
import UserModel from "../lib/userModel";
import { requireUser } from "../lib/auth";

const j = (x) => JSON.parse(JSON.stringify(x));

export const getMyBlogs = async ({ status } = {}) => {
  let session;
  try { session = await requireUser(); } catch { return { success: false, data: [] }; }
  await dbConnect();

  const filter = { authorId: session.clerkId };
  if (status === "published" || status === "draft") filter.status = status;

  const blogs = await BlogModel.find(filter).sort({ updatedAt: -1 }).lean();
  return { success: true, data: j(blogs) };
};

export const getMyStats = async () => {
  let session;
  try { session = await requireUser(); } catch { return { success: false, data: null }; }
  await dbConnect();

  const blogs = await BlogModel.find({ authorId: session.clerkId })
    .select("views likes status")
    .lean();

  const totalViews = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const totalLikes = blogs.reduce((s, b) => s + (b.likes || 0), 0);
  const published = blogs.filter((b) => b.status === "published").length;
  const drafts = blogs.filter((b) => b.status === "draft").length;

  return {
    success: true,
    data: { totalViews, totalLikes, published, drafts, total: blogs.length },
  };
};

export const updateProfile = async (input) => {
  let session;
  try { session = await requireUser(); } catch { return { success: false, data: "Not signed in." }; }
  await dbConnect();

  const allowed = ["displayName", "bio", "avatarUrl", "socials", "username"];
  const update = {};
  for (const k of allowed) {
    if (input[k] !== undefined) update[k] = input[k];
  }
  if (typeof update.bio === "string") update.bio = update.bio.slice(0, 280);
  if (typeof update.username === "string") {
    update.username = update.username.toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!update.username) return { success: false, data: "Username cannot be empty." };
    if (update.username !== session.profile.username) {
      const taken = await UserModel.exists({ username: update.username, clerkId: { $ne: session.clerkId } });
      if (taken) return { success: false, data: "Username already taken." };
    }
  }

  const updated = await UserModel.findOneAndUpdate(
    { clerkId: session.clerkId },
    { $set: update },
    { new: true }
  );

  if (update.username || update.displayName || update.avatarUrl) {
    const blogPatch = {};
    if (update.username)    blogPatch.authorUsername = update.username;
    if (update.displayName) blogPatch.authorName = update.displayName;
    if (update.avatarUrl !== undefined) blogPatch.authorAvatar = update.avatarUrl;
    await BlogModel.updateMany({ authorId: session.clerkId }, { $set: blogPatch });
  }

  return { success: true, data: j(updated) };
};

export const getUserByUsername = async (username) => {
  await dbConnect();
  const user = await UserModel.findOne({ username }).lean();
  if (!user) return { success: false, data: "User not found." };
  const blogs = await BlogModel.find({
    authorId: user.clerkId,
    status: "published",
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  return { success: true, data: { user: j(user), blogs: j(blogs) } };
};
