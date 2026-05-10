import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from '@/app/lib/connect';
import UserModel from "@/app/lib/userModel";

const requireSelf = async (paramEmail) => {
  const u = await currentUser();
  if (!u) return { error: NextResponse.json({ success: false, data: "unauthenticated" }, { status: 401 }) };
  const email = u.primaryEmailAddress?.emailAddress;
  if (!email || email !== paramEmail) {
    return { error: NextResponse.json({ success: false, data: "forbidden" }, { status: 403 }) };
  }
  return { user: u, email };
};

export async function GET(request, { params }) {
  await dbConnect();
  const { email } = await params;
  const guard = await requireSelf(email);
  if (guard.error) return guard.error;

  const user = await UserModel.findOne({ clerkId: guard.user.id });
  if (!user) return NextResponse.json({ success: false, data: "user dont exist" });
  return NextResponse.json({ success: true, data: user });
}

export async function POST(request, { params }) {
  await dbConnect();
  const { email } = await params;
  const guard = await requireSelf(email);
  if (guard.error) return guard.error;

  const existing = await UserModel.findOne({ clerkId: guard.user.id });
  if (existing) return NextResponse.json({ success: true, data: existing });

  const { liked = [], readLater = [] } = await request.json();
  const username = (email.split("@")[0] || `user${Date.now()}`).toLowerCase();
  const created = await UserModel.create({
    clerkId: guard.user.id,
    email,
    username,
    displayName: guard.user.fullName || username,
    avatarUrl: guard.user.imageUrl || "",
    liked,
    readLater,
  });
  return NextResponse.json({ success: true, data: created });
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { email } = await params;
  const guard = await requireSelf(email);
  if (guard.error) return guard.error;

  const { field, slug } = await request.json();
  if (!["liked", "readLater"].includes(field)) {
    return NextResponse.json({ success: false, data: "invalid field" }, { status: 400 });
  }
  const updated = await UserModel.findOneAndUpdate(
    { clerkId: guard.user.id },
    { $addToSet: { [field]: slug } },
    { new: true }
  );
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { email } = await params;
  const guard = await requireSelf(email);
  if (guard.error) return guard.error;

  const { field, slug } = await request.json();
  if (!["liked", "readLater"].includes(field)) {
    return NextResponse.json({ success: false, data: "invalid field" }, { status: 400 });
  }
  const updated = await UserModel.findOneAndUpdate(
    { clerkId: guard.user.id },
    { $pull: { [field]: slug } },
    { new: true }
  );
  return NextResponse.json({ success: true, data: updated });
}
