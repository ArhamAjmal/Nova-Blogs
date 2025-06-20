"use server"
import React from 'react'
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from 'next/image';
import styles from './library.module.css'
import SignOutWrapper from './SignoutWrapper';
const Profile =async () => {
    const user = await currentUser();
    console.log(user?.imageUrl)
  return (
    <section className={styles.profile}>
      <Image
      height={100}
      width={100}
      src={user?.imageUrl}
      alt={user?.username}
      style={{borderRadius:"100px",height:"10rem",width:"10rem"}}
      />
      <h1>{user?.primaryEmailAddress.emailAddress}</h1>
      <SignOutWrapper/>
    </section>
  )
}

export default Profile
