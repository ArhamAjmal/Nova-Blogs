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
            height:'240px',
            maxWidth: '350px', // Responsive width
            maxHeight: '650px', // Your desired max height
            margin:'20px auto 0px auto',
            display:'flex',
            objectFit:'cover',
            border:"solid 2px",
          }}
      />
  )
}

export const mdxComponents = {
    img: Cimage,
  };