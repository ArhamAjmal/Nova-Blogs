import React from 'react'
import styles from './trend.module.css'
import FBlogs from '@/app/components/search/FBlogs'
import BlogModel from '@/app/lib/model'
import dbConnect from '@/app/lib/connect'
import Head from 'next/head'
import { auth, currentUser } from "@clerk/nextjs/server";
import UserModel from '@/app/lib/userModel'
import UserData from '@/app/actions/UserData'

const page = async() => {
    await dbConnect()
  const topLikedBlogs = await BlogModel.find()
  .sort({ likes: -1 }) // 🔼 Sort by likes in descending order
  .limit(15).select("title coverImageUrl slug");;            // ✅ Limit to top 9

    const blogs2=JSON.parse(JSON.stringify(topLikedBlogs))

    
    //     const user = await currentUser();
    // //  console.log(await checkAdmin())
    // //console.log("user:",user?.primaryEmailAddress.emailAddress)
    //   //  const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`);
    //       const userdata = await UserModel.findOne({email:user?.primaryEmailAddress.emailAddress});//.lean() to return a plain JavaScript object instead of a Mongoose document
    //       const data=JSON.parse(JSON.stringify(userdata))
    const Udata=await UserData()
    // console.log(blogs2)
  return (
    <>
    <Head>
      <title>Trending Blogs | My Blog</title>
      <meta name="description" content="Explore the most liked and trending blog posts on topics like tech, health, and innovation." />
      <meta property="og:title" content="Trending Blogs | Nova Blogs" />
      <meta property="og:description" content="Stay ahead with our trending blogs. See what everyone's reading right now!" />
      <meta property="og:url" content="https://yourdomain.com/trending" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://yourdomain.com/preview/trending.jpg" />
      <link rel="canonical" href="https://yourdomain.com/trending" />
    </Head>
    <main style={{minHeight:"100vh"}}>
     <h1 className={styles.heading}>Trending</h1>
     <section aria-label="Trending Blog Posts">
        <FBlogs trendlist={blogs2} userSaved={Udata.readLater}/>
      </section>    
    </main>
    </>
  )
}

export default page
