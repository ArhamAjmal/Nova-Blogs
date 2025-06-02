//get blogs by category+tags
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import { NextResponse } from "next/server";

export async function GET(request) {//get limited blogs of specific tags->call in specific tags page
   let finishh=false;
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const tags =await searchParams.get("selected");
   const tagsArray = tags ? tags.split(',') : [];//// Convert tags string to array
  const skip =await searchParams.get("skip");
   if(skip!=null){
    const blogs=await BlogModel.find({tags:{$in:tagsArray},}).skip(skip).sort({ date: -1 }).limit(9).select("title coverImageUrl slug");
     if(blogs.length<9){finishh=true}
    return NextResponse.json({success:true,data:blogs,finish:finishh})

  }
 
  const blogs=await BlogModel.find({tags:{$in:tagsArray},}).sort({ date: -1 }).limit(4).select("title coverImageUrl slug");
  //console.log(tagsArray)
    if(blogs.length<4){finishh=true}


    return NextResponse.json({success:true,data:blogs,finish:finishh})
}
//const allBlogs = await BlogModel.find({tags:{$in:["goof","Areeb"]},}); // Returns array of blogs which match any one tag
//const allBlogs = await BlogModel.find({tags:{$all:["goof","wlwww","Habibi"]},}); // Returns array of blogs which has all specified tags(does not matter contain any extra tag ot not)
   