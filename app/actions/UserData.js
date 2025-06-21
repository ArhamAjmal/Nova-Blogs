"use server"

import dbConnect from "../lib/connect"
import BlogModel from "../lib/model";
import { auth, currentUser } from "@clerk/nextjs/server";
import UserModel from "../lib/userModel";

const UserData= async() => {
    await dbConnect();
   const user = await currentUser();
   if(!user){
    const ele={id:[],liked:[],readLater:[]}
    return ele
   }
    const userdata = await UserModel.findOne({email:user?.primaryEmailAddress.emailAddress});//.lean() to return a plain JavaScript object instead of a Mongoose document
    const data=JSON.parse(JSON.stringify(userdata))

    return(data)
}

export default UserData
