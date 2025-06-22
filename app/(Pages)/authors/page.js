import getAuthors from '@/app/actions/getAuthors'
import CatList from '@/app/components/categories/CatList'
import React from 'react'
import styles from './authors.module.css'

const page =async () => {
    const authors=await getAuthors()
  return (
    <main style={{minHeight:"100vh"}} >
    <div className={styles.AuthorTitle}>Authors</div>
        
      <CatList list={authors} auth={true}/>
    </main>
  )
}

export default page
