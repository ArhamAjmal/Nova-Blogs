import React from 'react';
import styles from './about.module.css';

const Page = () => {
  return (
    <div>
      <div className={styles.aboutcontainer}>
        <h1>About Us</h1>
        <p>
          Welcome to our blog! We are passionate about sharing knowledge, insights, and real-life experiences
          on a wide range of topics from technology and development to lifestyle and creativity.
        </p>
        <p>
          Our mission is to inform, inspire, and connect with readers by delivering high quality and authentic
          content. Whether you&apos;re here to learn something new, stay updated, or simply enjoy a good read,
          we&apos;ve got something for everyone.
        </p>
        <p>
          This blog is built using Next.js, combining performance and simplicity to provide a seamless reading
          experience. We believe in building with modern tools and writing with heart.
        </p>
        <p>
          Thank you for stopping by. If you have questions, ideas, or just want to say hello,
          feel free to reach out through our Contact page.
        </p>
      </div>
    </div>
  );
};

export default Page;
