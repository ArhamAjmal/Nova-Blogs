import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';

export async function GET(request) {//Fetch All Blogs->All Blogs Page
  await dbConnect();
  //const { searchParams } = new URL(request.url);
//   const skip = searchParams.get("skip");

  //This uses distinct("category") to get all unique categories.
   const categories = await BlogModel.distinct("category");
   console.log(categories)
  //console.log(allBlogs)
  return NextResponse.json({success:true,data:categories})
}