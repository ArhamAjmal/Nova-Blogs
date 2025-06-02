//get specfic blog
import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
import mongoose from 'mongoose';

export async function GET(request, { params }) {//get a specific blog->blog/[slug] page
    await dbConnect();
    const {slug } =await params;
    //console.log(slug)
    const oneBlog = await BlogModel.findOne({ slug:slug });//.lean() to return a plain JavaScript object instead of a Mongoose document
    //console.log(oneBlog)
    if(oneBlog==null){
      return Response.json({success:false,data:"Not Found"});
    }
    return Response.json({success:true,data:oneBlog});
  }

  export async function POST(request, { params }) {//update like and shares of a blog->blog page
    await dbConnect();
    const {slug } =await params;//[slug]

    const body = await request.json();
    const { data } = body;//post data to update
    if(data=="like"){//condition for like
      const updatedBlog = await BlogModel.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true } // Return the updated document
    );
    }else if(data=="dislike"){
      const updatedBlog = await BlogModel.findOneAndUpdate(
      { slug },
      { $inc: { likes: -1 } }, // Increment likes by 1
      { new: true } // Return the updated document
    );
    }
    
  return NextResponse.json({success:true,data:"posted"})
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