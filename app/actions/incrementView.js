"use server";

import { cookies } from "next/headers";
import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";
import { getSessionUser, isOwnerOrAdmin } from "../lib/auth";

const SIX_HOURS = 60 * 60 * 6;

const incrementView = async (slug) => {
  if (!slug) return { counted: false };

  const jar = await cookies();
  const key = `nb_v_${slug}`;
  if (jar.get(key)) return { counted: false };

  await dbConnect();
  const blog = await BlogModel.findOne({ slug }).select("authorId status");
  if (!blog || blog.status !== "published") return { counted: false };

  const session = await getSessionUser();
  if (isOwnerOrAdmin(session, blog)) {
    jar.set(key, "1", { maxAge: SIX_HOURS, path: "/", sameSite: "lax" });
    return { counted: false };
  }

  await BlogModel.updateOne({ _id: blog._id }, { $inc: { views: 1 } });
  jar.set(key, "1", { maxAge: SIX_HOURS, path: "/", sameSite: "lax" });
  return { counted: true };
};

export default incrementView;
