'use server';

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

export async function deleteBlog(slug) {
    await dbConnect();
    const del=await BlogModel.findOneAndDelete({ slug });
    //revalidatePath("/home"); // Update this to match the page that shows blogs
    if(del){
        return(true)
    }
    else{
        return(false)
    }
}
