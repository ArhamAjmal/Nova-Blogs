"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { FaTwitter, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa6";
import styles from "./site.module.css";

const SiteFooter = () => {
  const { user, isLoaded } = useUser();
  const signedIn = isLoaded && !!user;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={`${styles.footerCol} ${styles.footerBrand}`}>
          <h4>Nova Blogs</h4>
          <p>Fresh perspectives and thought-provoking insights for curious minds.</p>
          <div className={styles.footerSocials}>
            <a className={styles.footerSocial} href="#" aria-label="Twitter"><FaTwitter size={14} /></a>
            <a className={styles.footerSocial} href="#" aria-label="Facebook"><FaFacebook size={14} /></a>
            <a className={styles.footerSocial} href="#" aria-label="Instagram"><FaInstagram size={14} /></a>
            <a className={styles.footerSocial} href="#" aria-label="GitHub"><FaGithub size={14} /></a>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4>Explore</h4>
          <Link href="/home">Home</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/trending">Trending</Link>
          <Link href="/tags">Tags</Link>
        </div>

        <div className={styles.footerCol}>
          <h4>Account</h4>
          {signedIn ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/blogs/new">Write a Blog</Link>
              <Link href="/dashboard/settings">Settings</Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">Sign in</Link>
              <Link href="/sign-up">Create account</Link>
            </>
          )}
        </div>

        <div className={styles.footerCol}>
          <h4>Company</h4>
          <Link href="/aboutus">About</Link>
          <a href="mailto:novablogs@gmail.com">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>&copy; {new Date().getFullYear()} Nova Blogs. All rights reserved.</span>
        <span>Made with care by the Nova team.</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
