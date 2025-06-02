"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const fetchBlog = async(slug) => {
    await dbConnect();
    const oneBlog = await BlogModel.findOne({ slug });//.lean() to return a plain JavaScript object instead of a Mongoose document
    if(oneBlog){
    const oneBlog2=JSON.parse(JSON.stringify(oneBlog))
      return({success:true,data:oneBlog2})
    }else{
    return({success:false,data:"blog not found"})
    }
    
}

export default fetchBlog
