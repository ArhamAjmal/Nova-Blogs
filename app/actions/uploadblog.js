"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const uploadblog = async(data) => {
    await dbConnect();
    console.log(data)
    const slug=data.slug
     // Check if a blog with the same slug already exists
  const existing = await BlogModel.findOne({ slug });

  if (existing) {
    console.log("slug already exist")
    return({Success:false,data:"Slug already exist"})
  }
  else{
    //trimming
    const trimfun=(obj)=>{
      const trimmed = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      trimmed[key] = obj[key].trim();
    } else {
      trimmed[key] = obj[key]; // keep non-strings untouched
    }
  }
  return trimmed;
    }
    const clean = trimfun(data);
    const newData=new BlogModel(clean)
    // .then(ress=>console.log("Add:",ress))//Models automatically save data in a pluralized collection (e.g., "todos" from model name Todo).
    // .catch(err=>console.log("error:",err.errors))//printing age specific error
    const savedBlog = await newData.save();
    return({success:true,data:JSON.parse(JSON.stringify(savedBlog)) })

  }
    
    ////*/
    // const oneBlog = await BlogModel.findOne({ slug });//.lean() to return a plain JavaScript object instead of a Mongoose document
    // const oneBlog2=JSON.parse(JSON.stringify(oneBlog))
  
}

export default uploadblog
