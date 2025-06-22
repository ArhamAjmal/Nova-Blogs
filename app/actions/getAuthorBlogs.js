"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const getAuthorBlogs =async (author) => {
    await dbConnect();
    
    const blogs=await BlogModel.find({ author }).sort({ date: -1 }).select("title coverImageUrl slug");//.select("title coverImageUrl") tells Mongoose to include only these two fields.
    const blogs2=JSON.parse(JSON.stringify(blogs))
    return({success:true,data:blogs2})  
  
}

export default getAuthorBlogs
