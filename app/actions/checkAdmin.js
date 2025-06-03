/*import { auth, currentUser } from "@clerk/nextjs/server";
import React from 'react'

const checkAdmin =async () => {
    const user=await currentUser()
    const adminEmail1 = "arhamoajmal@gmail.com";
    if (!user ) {
        // console.log("User not exist")
        return(false)
      }else if(user?.primaryEmailAddress.emailAddress === adminEmail1){
        // console.log("you are admin")
        return(true)
      }
      else{
        // console.log("you are not admin")
        return(false)
      }


}

export default checkAdmin
*/