import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';

export async function GET(request) {//Fetch unique tags->All Blogs Page
  await dbConnect();
   const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  if(category!=null){
       const tags = await BlogModel.distinct("tags", { category: { $regex: new RegExp(`^${category}$`, 'i') } });
        return NextResponse.json({success:true,data:tags})

  }
  //This uses distinct("category") to get all unique categories.
   const tags = await BlogModel.distinct("tags");
//    console.log(tags)
  //console.log(allBlogs)
  return NextResponse.json({success:true,data:tags})
}