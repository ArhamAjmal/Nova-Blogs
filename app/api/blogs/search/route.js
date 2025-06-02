//get searched blogs
import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
export async function GET(request) {
 let finishh=false;
 await dbConnect();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const skipp = searchParams.get("skip");
  const limit=9;
  if(skipp!=null){
  const sBlogs = await BlogModel.find({title:{$regex: q, $options: "i" }}).skip(skipp).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug"); // Searching
  if(sBlogs.length<limit){finishh=true}
  return NextResponse.json({success:(sBlogs.length>0),data:sBlogs,finish:finishh})
  }
  const sBlogs = await BlogModel.find({title:{$regex: q, $options: "i" }}).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug"); // Searching
    if(sBlogs.length<limit){finishh=true}

  // console.log(allBlogs)
  return NextResponse.json({success:(sBlogs.length>0),data:sBlogs,finish:finishh})
}