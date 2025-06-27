import getAuthors from '@/app/actions/getAuthors'
import CatList from '@/app/components/categories/CatList'
import React from 'react'
import styles from './authors.module.css'
import Image from 'next/image'

const page =async () => {
    const authors=await getAuthors()
  return (
    <main style={{minHeight:"100vh"}} >
    <div className={styles.AuthorTitle}>
              <Image width={100} height={100} src={'/quill-pen.png'} style={{height:"1.5rem",width:"1.5rem"}}/>
      Authors</div>
      <p className={styles.paragraph}>Explore intriguing niches that challenge your thinking and spark new ideas.</p>
        
      <CatList list={authors} auth={true}/>
    </main>
  )
}

export default page
