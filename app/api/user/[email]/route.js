//updating user info
import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import UserModel from "@/app/lib/userModel";

//user apis
export async function GET(request, { params }) {//Get User info
  await dbConnect();
  const {email } =await params;
  const user = await UserModel.findOne({email});//.lean() to return a plain JavaScript object instead of a Mongoose document
  // console.log(user)
  if(!user){
      return NextResponse.json({success:false,data:"user dont exist"})
  }
  return NextResponse.json({success:true,data:user})
}
export async function POST(request, { params }) {//Create user
  const {liked, readLater } = await request.json();
  const {email } =await params;
  await dbConnect();
  const newData=new UserModel({email,liked,readLater})
   newData.save()
  return NextResponse.json({ success: true, data: "Upload data" });
}
export async function PUT(request, {params}) {//update liked and read later array pf user
  const { field, slug } = await request.json();
  const {email } =await params;
  await dbConnect();

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const updatedUser = await UserModel.findOneAndUpdate({ email },
    { $addToSet: { [field]: slug } }, // Ensures uniqueness
    { new: true }
  );

  return NextResponse.json({ success: true, data: updatedUser });
}
export async function DELETE(request, {params}) {//delete slug from liked and read later array of user
  const { field, slug } = await request.json();
  const {email } =await params;
  await dbConnect();

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const updatedUser = await UserModel.findOneAndUpdate({ email },
    { $pull: { [field]: slug } }, // Ensures uniqueness
    { new: true }
  );

  return NextResponse.json({ success: true, data: updatedUser });
}

  /**Cheat sheet for operations
   * 1.Get:
   * a)const allBlogs = await BlogModel.find(); // Returns array of all blogs
   * b)const oneBlog = await BlogModel.findOne({ ID: 345 });
   * c)const oneBlog = await BlogModel.findById("mongodbObjectIdHere");
   * d)const blogs = await BlogModel.find({ category: "Tech" }).sort({ date: -1 }).limit(5);
   * 2.Update
   * a)BlogModel.updateOne({title:"My Blog5"},{title:"My Blog6"})
   * b)seperate for id
   * 3.Delete
   * a)await BlogModel.deleteOne({ ID: 345 });
   * b)await BlogModel.deleteMany({ category: "OldCategory" });
   * c)await BlogModel.findByIdAndDelete("mongodbObjectIdHere");
   * 
   */