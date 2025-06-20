"use client";
import { SignInButton } from "@clerk/nextjs";
import styles from './library.module.css'

const SigninWrapper = () => (
   <div style={{display:"flex",justifyContent:"center",padding:"1rem"}}>
  <SignInButton>
    <button className={styles.signoutbutton}>Sign in</button>
  </SignInButton>
  </div>
);

export default SigninWrapper
