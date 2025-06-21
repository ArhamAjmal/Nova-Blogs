"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const getLimitedBlogs =async (category) => {
    await dbConnect();
    // console.log("elleeeeeeeee",category)
    const limit=6;

  if(category=="Recent"){
      const blogs=await BlogModel.find().sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");//.select("title coverImageUrl") tells Mongoose to include only these two fields.
     const blogs2=JSON.parse(JSON.stringify(blogs))
      return({success:true,data:blogs2})   
       //   console.log("eleeeeee")
    //   console.log(blogs)
  }
    const blogs=await BlogModel.find({ category }).sort({ date: -1 }).limit(limit).select("title coverImageUrl slug");//.select("title coverImageUrl") tells Mongoose to include only these two fields.
    const blogs2=JSON.parse(JSON.stringify(blogs))
    return({success:true,data:blogs2})  
  
}

export default getLimitedBlogs
