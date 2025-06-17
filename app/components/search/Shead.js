import React from 'react'
import styles from './SBlogs.module.css'

const Shead = (props) => {
  const a=props.query
  return (
    <h1 className={styles.sh}>
      Search for: {a}
    </h1>
  )
}

export default Shead
