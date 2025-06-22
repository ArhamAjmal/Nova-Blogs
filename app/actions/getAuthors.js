"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const getAuthors = async() => {
    await dbConnect();
   const a = await BlogModel.distinct("author");
    const a2=JSON.parse(JSON.stringify(a))
    console.log(a2)
    return(a2)
}

export default getAuthors
