import Image from 'next/image'
import React from 'react'

const Cimage = ({ src, alt}) => {
  return (
    <Image
        src={src}
        alt={alt || 'Blog Image'}
        width={800}
        height={300}
        style={{
            height:'17rem',
            width: '26rem', // Responsive width
            margin:'20px auto 0px auto',
            display:'flex',
            objectFit:'fill',
            border:"solid 2px",
          }}
      />
  )
}

export const mdxComponents = {
    img: Cimage,
  };