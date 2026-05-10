"use server";

import dbConnect from "../lib/connect";
import CommentModel from "../lib/commentModel";
import BlogModel from "../lib/model";
import { requireUser, getSessionUser, isOwner } from "../lib/auth";

const j = (x) => JSON.parse(JSON.stringify(x));

const shapeForClient = (doc, sessionClerkId = null) => {
  const o = j(doc);
  o.clapsCount = (o.claps || []).length;
  o.clapped = !!(sessionClerkId && (o.claps || []).includes(sessionClerkId));
  delete o.claps;
  return o;
};

export const listComments = async (slug) => {
  await dbConnect();
  if (!slug) return { success: true, data: { comments: [], total: 0 } };

  const session = await getSessionUser();
  const sessionClerkId = session?.clerkId || null;

  const all = await CommentModel.find({ blogSlug: slug, deleted: false })
    .sort({ createdAt: 1 })
    .lean();

  const byParent = new Map();
  byParent.set(null, []);
  for (const c of all) {
    const key = c.parentId ? String(c.parentId) : null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(shapeForClient(c, sessionClerkId));
  }

  const top = (byParent.get(null) || []).map((c) => ({
    ...c,
    replies: (byParent.get(String(c._id)) || []),
  }));

  return { success: true, data: { comments: top, total: all.length } };
};

export const postComment = async ({ slug, body, parentId = null }) => {
  let session;
  try { session = await requireUser(); } catch { return { success: false, data: "Sign in to comment." }; }
  await dbConnect();

  const trimmed = String(body || "").trim();
  if (!trimmed) return { success: false, data: "Comment can't be empty." };
  if (trimmed.length > 2000) return { success: false, data: "Comment too long (2000 char max)." };

  const blog = await BlogModel.findOne({ slug }).select("_id status").lean();
  if (!blog) return { success: false, data: "Blog not found." };
  if (blog.status !== "published") return { success: false, data: "Comments are disabled on drafts." };

  if (parentId) {
    const parent = await CommentModel.findById(parentId).select("blogSlug parentId deleted").lean();
    if (!parent || parent.deleted || parent.blogSlug !== slug) {
      return { success: false, data: "Reply target not found." };
    }
    if (parent.parentId) parentId = parent.parentId;
  }

  const created = await CommentModel.create({
    blogId: blog._id,
    blogSlug: slug,
    body: trimmed,
    parentId: parentId || null,
    authorId: session.clerkId,
    authorUsername: session.profile.username,
    authorName: session.profile.displayName || session.fullName,
    authorAvatar: session.profile.avatarUrl || session.imageUrl || "",
  });

  return { success: true, data: shapeForClient(created.toObject(), session.clerkId) };
};

export const deleteComment = async (commentId) => {
  let session;
  try { session = await requireUser(); } catch { return { success: false, data: "Sign in." }; }
  await dbConnect();

  const c = await CommentModel.findById(commentId);
  if (!c || c.deleted) return { success: false, data: "Comment not found." };

  let allowed = c.authorId === session.clerkId;
  if (!allowed) {
    const blog = await BlogModel.findOne({ slug: c.blogSlug }).select("authorId").lean();
    if (blog && isOwner(session, blog)) allowed = true;
  }
  if (!allowed) return { success: false, data: "Not allowed." };

  c.deleted = true;
  c.body = "";
  await c.save();
  return { success: true, data: { _id: String(c._id) } };
};

export const toggleClap = async (commentId) => {
  let session;
  try { session = await requireUser(); } catch { return { success: false, data: "Sign in to clap." }; }
  await dbConnect();

  const c = await CommentModel.findById(commentId);
  if (!c || c.deleted) return { success: false, data: "Comment not found." };

  const has = (c.claps || []).includes(session.clerkId);
  if (has) c.claps = c.claps.filter((id) => id !== session.clerkId);
  else c.claps = [...(c.claps || []), session.clerkId];
  await c.save();

  return {
    success: true,
    data: {
      _id: String(c._id),
      clapsCount: c.claps.length,
      clapped: !has,
    },
  };
};

export const getCommentCount = async (slug) => {
  await dbConnect();
  return CommentModel.countDocuments({ blogSlug: slug, deleted: false });
};
