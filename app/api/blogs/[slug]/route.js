import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import { getSessionUser, isOwnerOrAdmin } from "@/app/lib/auth";

export async function GET(request, { params }) {
  await dbConnect();
  const { slug } = await params;
  const blog = await BlogModel.findOne({ slug });
  if (!blog) return Response.json({ success: false, data: "Not Found" });
  if (blog.status !== "published") {
    const session = await getSessionUser();
    if (!isOwnerOrAdmin(session, blog)) {
      return Response.json({ success: false, data: "Not Found" });
    }
  }
  return Response.json({ success: true, data: blog });
}

export async function POST(request, { params }) {
  await dbConnect();
  const { slug } = await params;
  const { data } = await request.json();

  if (data === "like") {
    await BlogModel.updateOne({ slug }, { $inc: { likes: 1 } });
  } else if (data === "dislike") {
    await BlogModel.updateOne({ slug }, { $inc: { likes: -1 } });
  }

  return NextResponse.json({ success: true, data: "posted" });
}
