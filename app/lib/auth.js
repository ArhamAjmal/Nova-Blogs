import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "./connect";
import UserModel from "./userModel";

export const getSessionUser = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  await dbConnect();
  const dbUser = await UserModel.findOne({ clerkId: clerkUser.id });
  if (!dbUser) return null;
  return {
    clerkId: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    fullName: clerkUser.fullName || "",
    imageUrl: clerkUser.imageUrl || "",
    profile: dbUser,
  };
};

export const requireUser = async () => {
  const session = await getSessionUser();
  if (!session) {
    const err = new Error("UNAUTHENTICATED");
    err.code = "UNAUTHENTICATED";
    throw err;
  }
  return session;
};

export const isOwner = (session, blog) => {
  if (!session || !blog) return false;
  return !!(blog.authorId && blog.authorId === session.clerkId);
};

export const isOwnerOrAdmin = isOwner;
