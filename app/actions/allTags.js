"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";

const allTags = async() => {
    await dbConnect();
   const tags = await BlogModel.distinct("tags");
    const tags2=JSON.parse(JSON.stringify(tags))
    console.log(tags2)
    return(tags2)
}

export default allTags
