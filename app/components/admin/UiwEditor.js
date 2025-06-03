"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the editor to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const UiwEditor = () => {
  const [content, setContent] = useState("## Hello, Next.js!");

  return (
    <div className="container">
      <MDEditor value={content} onChange={setContent} height={400} />
      <button onClick={()=>console.log(content)}>Click</button>
    </div>
  );
};

export default UiwEditor;
