//get specfic blog
import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
import mongoose from 'mongoose';

export async function GET(request, { params }) {//get a specific blog->blog/[slug] page
    await dbConnect();
    const {slugs } =await params;
    const slugsarray = slugs ? slugs.split(',') : [];//// Convert tags string to array

    // console.log(slugsarray)
    const blogs = await BlogModel.find({ slug: { $in: slugsarray } }).select("title coverImageUrl slug");
    if(blogs.length==0){
      return Response.json({success:false,data:blogs});

    }
//    console.log(blogs)
    return Response.json({success:true,data:blogs});
  }
