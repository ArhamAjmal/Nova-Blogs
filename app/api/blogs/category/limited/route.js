//limited categories
import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';

export async function GET(request) {//get limited blogs of specific cateory->call in all blog page
    await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit=5;

  if(category=="Recent"){
      const blogs=await BlogModel.find().sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");//.select("title coverImageUrl") tells Mongoose to include only these two fields.
      return NextResponse.json({success:true,data:blogs})
  }
  const blogs=await BlogModel.find({ category }).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");//.select("title coverImageUrl") tells Mongoose to include only these two fields.

  //console.log(blogs)
  return NextResponse.json({success:true,data:blogs})
}
