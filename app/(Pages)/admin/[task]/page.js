import fetchBlog from '@/app/actions/fetchBlog';
import NotFoundPage from '@/app/components/action/NotFoundPage';
import MdxEditor from '@/app/components/admin/MdxEditor';
import UiwEditor from '@/app/components/admin/UiwEditor';
import { auth, currentUser } from "@clerk/nextjs/server";
import React from 'react'

const page =async ({ params,searchParams }) => {
      const user=await currentUser()
      const adminEmail1 = "arhamoajmal@gmail.com";
      const adminEmail2 = "tubaarif3905@gmail.com";
      const admin=(user?.primaryEmailAddress.emailAddress === adminEmail1||user?.primaryEmailAddress.emailAddress === adminEmail2)?true:false

      if(!admin){
        return(<NotFoundPage/>)
      }

     let { task } =await params; // Extract route param->params should be awaited
     const slug = searchParams.slug;

    //  console.log(slug)
     //here we fetch blog and send to edit
     const a=await fetchBlog(slug)
    //  console.log(a)
  return (
    <div style={{height:"fit-content"}}>
      <MdxEditor task={task} blogtoEdit={a.data}/>
      
    </div>
  )
}

export default page
