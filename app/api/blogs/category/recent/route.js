//get blogs by category+tags
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import { NextResponse } from "next/server";
export async function GET(request) {//get recent blogs->call in specific cat page
   let finishh=false;
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const skip =await searchParams.get("skip");
    const limit=9;

  if(skip!=null){
    const blogs=await BlogModel.find().skip(skip).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");
     
    if(blogs.length<limit){finishh=true}
    return NextResponse.json({success:true,data:blogs,finish:finishh})

  }
  const blogs=await BlogModel.find().sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");
    if(blogs.length<limit){finishh=true}
 
//  console.log(blogs)

    return NextResponse.json({success:true,data:blogs,finish:finishh})
}
