import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';

export async function GET(request) {//get limited blogs of specific cateory->call in all blog page
    await dbConnect();
  const { searchParams } = new URL(request.url);
  const tagss = searchParams.get("tags");
  const skip = searchParams.get("skip");
  const tagsArray = tagss ? tagss.split(',') : []
  const limit=5;

  //const blogs=await BlogModel.find({ category }).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");//.select("title coverImageUrl") tells Mongoose to include only these two fields.
  const blogs=await BlogModel.find({tags:{$in:tagsArray},slug: { $ne: skip } }).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");
  
  //console.log(blogs)
  return NextResponse.json({success:true,data:blogs})
}
