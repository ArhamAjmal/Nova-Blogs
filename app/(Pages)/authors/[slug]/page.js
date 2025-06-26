import getAuthorBlogs from '@/app/actions/getAuthorBlogs';
import FBlogs from '@/app/components/search/FBlogs';
import React from 'react'
import styles from '../authors.module.css'
import Image from 'next/image';

const page =async ({ params }) => {
    let { slug } =await params; // Extract route param->params should be awaited
     slug=decodeURIComponent(slug)

    //console.log(slug)
    const authBlogs=await getAuthorBlogs(slug)
  return (
    <main style={{minHeight:"100vh"}}>
        <h1 className={styles.slugDisplay}>
        <Image width={100} height={100} src={'/quill-pen.png'} style={{height:"1.4rem",width:"1.4rem"}}/>
          {slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
      <FBlogs authBlogs={authBlogs.data}/>
    </main>
  )
}

export default page
