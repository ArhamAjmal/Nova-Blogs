"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const allCategories = async() => {
    await dbConnect();
   const cat = await BlogModel.distinct("category");
    const cat2=JSON.parse(JSON.stringify(cat))
    console.log("Catttttttttt",cat2)
    return(cat2)
}

export default allCategories

