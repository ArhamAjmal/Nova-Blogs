"use client";
import { SignOutButton } from "@clerk/nextjs";
import styles from './library.module.css'

const SignOutWrapper = () => (
  <SignOutButton>
    <button className={styles.signoutbutton}>Sign out</button>
  </SignOutButton>
);

export default SignOutWrapper;
