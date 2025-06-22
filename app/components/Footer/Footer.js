"use client"
import React from 'react';
import styles from './Footer.module.css'
import { FaFacebook, FaInstagram, FaXTwitter, FaWhatsapp, FaW, FaTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const Footer = () => {
  const {user, isLoaded} = useUser();//is loaded?
  const adminEmail1 = "arhamoajmal@gmail.com";
  const adminEmail2 = "tubaarif3905@gmail.com";
  const admin=(isLoaded && (user?.primaryEmailAddress.emailAddress === adminEmail1||user?.primaryEmailAddress.emailAddress === adminEmail2))?true:false

  return (
    <footer className={styles.footer}>
      {admin&&<Link href={'/admin/create'}>Admin</Link>}
      <div className={styles.footercontent}>
        {/* About */}
        <div className={styles.footersection}>
          <h3>Contact</h3>
          <p>Email: novablogs@gmail.com</p>
          <p>Phone: +923264209959</p>       
          <h3>Follow us:</h3>
 
          <div className={styles.socialicons}>
            <a href="#"><span><FaFacebook/></span></a>
            <a href="#"><span><FaInstagram/></span></a>
            <a href="#"><span><FaWhatsapp/></span></a>
            <a href="#"><span><FaTwitter/></span></a>
          </div>
        </div>

        {/* Categories */}
        <div className={styles.footersection}>
          <ul>
            <h3 style={{marginLeft:"-0.2rem"}}>Categories</h3>
            <li>Technology</li>
            <li>Crypto</li>
            <li>Finance</li>
            <li>Future</li>
            <li>Health</li>
          </ul>
        </div>

        {/* Recent Posts */}
        <div className={`${styles.footersection} ${styles.width}`}>
          <h3>FAQs</h3>
          <ul>
            <li>10 Tips for Better Sleep</li>
            <li>How to Start Meditation</li>
            <li>Best Places to Visit in 2023</li>
            <li>Easy Dinner Recipes</li>
          </ul>
        </div>

        {/* Subscribe */}
        {/* <div className={styles.footersection}>
          <h3>Subscribe</h3>
          <p>Get the latest posts delivered straight to your inbox.</p>
          <input type="email" placeholder="Your email address" />
          <button>Subscribe</button>
        </div> */}
      </div>

      <div className={styles.footerbottom}>
        <p>&copy; 2025 Nova Blogs. All rights reserved.</p>
        <div className={styles.footerlinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms& Service</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
