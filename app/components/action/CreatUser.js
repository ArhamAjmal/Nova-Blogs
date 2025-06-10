"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const CreatUser = () => {
      const {user, isLoaded} = useUser();//is loaded?

        useEffect(() => {
            const a=async()=>{
                  //userdatabase
                const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`);
                const data = await res.json();
                if (!data.success) {
                     console.log("user is not registered")
                    //3.registering the logined user
                    const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`, {
                        method: "post", headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ liked: [], readLater: [] })
                    })
                    const data = await res.json();
                    console.log(data);
                } else console.log("user is registered")
            }
          if (isLoaded) {
            //1.checking if user logined
            if (user) {
                // console.log("user logined")
                //2.checking if user is registered or not
                a()
            }else console.log("not logined")
          }
        }, [isLoaded])
        
  return (
    <div>
        
    </div>
  )
}

export default CreatUser
