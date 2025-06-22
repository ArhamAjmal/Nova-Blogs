import getAuthorBlogs from '@/app/actions/getAuthorBlogs';
import FBlogs from '@/app/components/search/FBlogs';
import React from 'react'
import styles from '../authors.module.css'

const page =async ({ params }) => {
    let { slug } =await params; // Extract route param->params should be awaited
     slug=decodeURIComponent(slug)

    //console.log(slug)
    const authBlogs=await getAuthorBlogs(slug)
  return (
    <main style={{minHeight:"100vh"}}>
        <h1 className={styles.slugDisplay}>{slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
      <FBlogs authBlogs={authBlogs.data}/>
    </main>
  )
}

export default page
