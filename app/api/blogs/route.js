import { NextResponse } from "next/server";
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
import mongoose from 'mongoose';

export async function GET(request) {//Fetch All Blogs->All Blogs Page
  await dbConnect();
  const allBlogs = await BlogModel.find(); // Returns array of all blogs
  //console.log(allBlogs)
  return NextResponse.json({success:true,data:allBlogs})
}
export async function POST(request) {//Upload Blog ->Admin panel
let data=await request.json()//req.body
    //console.log("Data:",data)//our data we send throug post request
 
//mongo
const newData=new BlogModel(data)
newData.save()
.then(ress=>console.log("Add:",ress))//Models automatically save data in a pluralized collection (e.g., "todos" from model name Todo).
.catch(err=>console.log("error:",err.errors))//printing age specific error
////*/

  return NextResponse.json({success:true,data:"posted"})
}
export async function PUT(request) {//Update a blog->Admin panel
    let data=await request.json()//req.body
    //console.log("Data:",data)//updated dat
    /*BlogModel.updateOne({slug:data.slug},{title:"My New Blog"})
    .then(res=>console.log(res))*/
  await BlogModel.updateMany({}, { $set: { description: content } });

  return NextResponse.json({success:true,data:"updated"})
} 

export async function DELETE(request) {//Delete a blog->Admin panel
  let data=await request.json()//req.body
  console.log(data.slug) 
     BlogModel.deleteOne({ slug: data.slug })
     .then(res=>{console.log(res)})
    //await BlogModel.deleteMany({ category: "Science" });
    //console.log(data.idd)


  return NextResponse.json({success:true,data:"deleted"})
}
