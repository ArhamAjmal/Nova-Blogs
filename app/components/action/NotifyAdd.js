import React from 'react'
import styles from './action.module.css'
import Link from 'next/link';
import Image from 'next/image';

const NotifyAdd = (props) => {
    let show=props.show;
     let task=props.task;
    let title=task=="add"? "Blog added to ":"Blog removed from "
    // console.log(title)
  return (
    <div className={`${styles.not} ${show ? styles.show : styles.hide}`}>
       <div className={`${styles.savednotification} ${task=="remove"? styles.red :""}`}>
      <Image
        src={task=="add"? '/check.png':"/remove.png"} // Replace with your tick image path
        alt="Saved"
        width={20}
        height={20}
        className={styles.tickicon}
      />
      <span>
        {title}
        <Link href="/savedblogs" className={`${styles.savedlink} ${task=="remove" ? styles.savedlink2 :""}`}>
          saved blogs
        </Link>
      </span>
    </div>
    </div>
  )
}

export default NotifyAdd
