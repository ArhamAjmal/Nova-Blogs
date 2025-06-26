import React from 'react'
import styles from './action.module.css'
import Link from 'next/link';
import Image from 'next/image';

const NotifyRemove = (props) => {
    let show=props.show;

  return (
    <div className={`${styles.not} ${show ? styles.show : styles.hide}`}>
       <div className={styles.removenotification}>
      <Image
        src="/remove.png" // Replace with your tick image path
        alt="Removed"
        width={20}
        height={20}
        className={styles.tickicon}
      />
      <span>
        Blog added to{" "}
        <Link href="/savedblogs" className={styles.savedlink}>
          saved blogs
        </Link>
      </span>
    </div>
    </div>
  )
}

export default NotifyRemove
