"use server";

import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "../lib/connect";
import UserModel from "../lib/userModel";
import BlogModel from "../lib/model";

const ADMIN_EMAILS = new Set([
  "arhamoajmal@gmail.com",
  "tubaarif3905@gmail.com",
]);

const baseUsernameFrom = (clerkUser) => {
  const fromClerk = clerkUser.username?.trim();
  if (fromClerk) return fromClerk.toLowerCase();
  const email = clerkUser.primaryEmailAddress?.emailAddress || "";
  const local = email.split("@")[0] || `user${Date.now()}`;
  return local.replace(/[^a-z0-9_]/gi, "").toLowerCase() || `user${Date.now()}`;
};

const ensureUniqueUsername = async (base) => {
  let candidate = base;
  let suffix = 0;
  while (await UserModel.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
};

const syncUser = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return { success: false, data: "not signed in" };

  await dbConnect();

  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) return { success: false, data: "no primary email" };

  let existing = await UserModel.findOne({ clerkId: clerkUser.id });

  if (!existing) {
    const legacy = await UserModel.findOne({ email });
    if (legacy && !legacy.clerkId) {
      legacy.clerkId = clerkUser.id;
      if (!legacy.username) {
        legacy.username = await ensureUniqueUsername(baseUsernameFrom(clerkUser));
      }
      if (!legacy.displayName) {
        legacy.displayName = clerkUser.fullName || clerkUser.firstName || legacy.username;
      }
      if (!legacy.avatarUrl) legacy.avatarUrl = clerkUser.imageUrl || "";
      if (ADMIN_EMAILS.has(email)) legacy.role = "admin";
      await legacy.save();
      existing = legacy;
    }
  }

  if (existing) {
    let dirty = false;
    let avatarChanged = false;
    let displayNameChanged = false;
    if (existing.email !== email) { existing.email = email; dirty = true; }
    if (clerkUser.imageUrl && existing.avatarUrl !== clerkUser.imageUrl) {
      existing.avatarUrl = clerkUser.imageUrl; dirty = true; avatarChanged = true;
    }
    const fullName = clerkUser.fullName || clerkUser.firstName || "";
    if (fullName && !existing.displayName) {
      existing.displayName = fullName; dirty = true; displayNameChanged = true;
    }
    const desiredRole = ADMIN_EMAILS.has(email) ? "admin" : existing.role;
    if (existing.role !== desiredRole) { existing.role = desiredRole; dirty = true; }
    if (dirty) await existing.save();
    if (avatarChanged || displayNameChanged) {
      const patch = {};
      if (avatarChanged) patch.authorAvatar = existing.avatarUrl;
      if (displayNameChanged) patch.authorName = existing.displayName;
      await BlogModel.updateMany({ authorId: existing.clerkId }, { $set: patch });
    }
    return { success: true, data: JSON.parse(JSON.stringify(existing)) };
  }

  const username = await ensureUniqueUsername(baseUsernameFrom(clerkUser));
  const created = await UserModel.create({
    clerkId: clerkUser.id,
    email,
    username,
    displayName: clerkUser.fullName || clerkUser.firstName || username,
    avatarUrl: clerkUser.imageUrl || "",
    bio: "",
    role: ADMIN_EMAILS.has(email) ? "admin" : "user",
  });

  return { success: true, data: JSON.parse(JSON.stringify(created)) };
};

export default syncUser;
