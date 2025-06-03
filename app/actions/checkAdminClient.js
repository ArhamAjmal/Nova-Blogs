/*"use client"
import { useUser } from '@clerk/nextjs';

const checkAdminClient =async () => {
  const {user, isLoaded} = useUser();//is loaded?
  const adminEmail1 = "arhamoajmal@gmail.co";
    if (isLoaded && !user ) {
        // console.log("User not exist")
        return(false)
      }else if(isLoaded && user?.primaryEmailAddress.emailAddress === adminEmail1){
        // console.log("you are admin")
        return(true)
      }
      else{
        // console.log("you are not admin")
        return(false)
      }


}

export default checkAdminClient*/
