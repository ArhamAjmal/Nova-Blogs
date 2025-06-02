import React from 'react'
import styles from './SBlogs.module.css'

const Shead = (props) => {
  const a=props.query
  return (
    <div className={styles.sh}>
      Search for: {a}
    </div>
  )
}

export default Shead
