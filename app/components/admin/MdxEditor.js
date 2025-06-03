"use client";

import { useEffect, useRef, useState } from "react";
import uploadblog from "@/app/actions/uploadblog";
import { useRouter } from "next/navigation";
import editblog from "@/app/actions/editBlog";

import dynamic from "next/dynamic";

// Dynamically import the editor to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MdxEditor(props) {
  const r=useRouter()
  // const editorRef = useRef(null);
  // const editorInstance = useRef(null);
  const task=props.task
  const blog=props.blogtoEdit
  //console.log(blog)
  // Blog data state
  const [tagComma, settagComma] = useState()
  const [content, setContent] = useState(blog?.description||"## Hello, Next.js!");
  const [blogData, setBlogData] = useState({
    title:blog?.title ||"",
    category:blog?.category || "",
    description:blog?.description || "", // markdown handled separately
    tags:blog?.tags || [],
    slug:blog?.slug || "",
    coverImageUrl: blog?.coverImageUrl ||"",
    author:blog?.author ||"",
  });
/*/toast code
  useEffect(() => {
     if (!editorRef.current || editorInstance.current) return;

  // Clear previous children (in case hot reload or re-render happens)
        editorRef.current.innerHTML = "";
    if (editorRef.current) {
      // Attach editor inside a wrapper, not directly on the container
      const editorWrapper = document.createElement("div");
      editorRef.current.appendChild(editorWrapper);

      editorInstance.current = new Editor({
        el: editorWrapper,
        height: "800px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        initialValue:blog?.description || "##Start Writing...",
        
      });
      // Hide horizontal scrollbar
    editorWrapper.style.overflowX = "hidden";
    editorWrapper.style.overflowY = "hidden";
    editorWrapper.style.width = "100%";
    }
     // Cleanup to prevent duplicate editors
  return () => {
    if (editorInstance.current) {
      editorInstance.current.destroy();
      editorInstance.current = null;
    }

    if (editorRef.current) {
      editorRef.current.innerHTML = ""; // Clear any leftover wrapper
    }
  };
  }, []);*/
 // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for tags (comma separated string to array)
    if (name === "tags") {
      console.log("Elelee",value.endsWith(" "))
      if(value.trim().endsWith(",")||value.endsWith(" ")){
        settagComma(true)
        setBlogData((prev) => ({
        ...prev,
        tags: value,
      }));
        return
      }
      settagComma(false)
      const tagArray = value.split(",").map((tag) => tag.trim()).filter(Boolean);
      console.log(value)
      console.log(tagArray)
      setBlogData((prev) => ({
        ...prev,
        tags: tagArray,
      }));
    } else {
      setBlogData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  //toast code
  const handleedit =async () => {
      const finalData = {
        ...blogData,
        description: content,
      };
      console.log(finalData)
      const isAnyFieldEmpty = Object.values(finalData).some(value => value === '');
      if (isAnyFieldEmpty) {
      alert('Please fill out all the fields');
      return; // prevent further action like form submissio
    }
    //  console.log("Submitted Blog Data:", finalData);
     //server action to edit blog
     const ed=await editblog(finalData)
     console.log(ed)
     if(ed.success){
      alert("File Edited")
      // console.log(up.data.slug)
      r.push(`/blog/${blog?.slug}`)
      // const a=confirm("File uploaded")
      // if(a)console.log("Yes")
      //   else console.log("No")
     }else{
      alert(`Edit Failed:${up.data}`)
     }

    }
  
    const handleupload =async () => {
      
      const finalData = {
        ...blogData,
        description: content,
      };
      console.log(finalData)
      const isAnyFieldEmpty = Object.values(finalData).some(value => value === '');
      if (isAnyFieldEmpty) {
      alert('Please fill out all the fields');
      return; // prevent further action like form submissio
    }
     const up=await uploadblog(finalData)
     console.log(up)
     if(up.success){
      alert("File Uploaded")
      r.push(`/blog/${up.data.slug}`)
     }else{
      alert(`Upload Failed:${up.data}`)
     }
  }

  return (
    <div style={{ padding: "2rem",overflowX: "hidden",width:"100%",height:"200vh"}}>
     {(task=="edit")&& <button onClick={()=>r.push('/admin/create')}>Create Blog</button>}
      <div style={{textAlign:"center",fontSize:'1.5rem',fontWeight:"bold",color:"gray"}}>{task.charAt(0).toUpperCase() + task.slice(1)} Blog</div>
      <div style={{overflow:"hidden"}} >
         <input
        type="text"
        name="title"
        placeholder="Blog Title"
        value={blogData.title}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={blogData.category}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="slug"
        placeholder="Slug (e.g., blog-title)"
        value={blogData.slug}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="coverImageUrl"
        placeholder="Cover Image URL"
        value={blogData.coverImageUrl}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="author"
        placeholder="Author Name"
        value={blogData.author}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated: tag1,tag2,tag3)"
        onChange={handleChange}
        value={blogData.tags}
        style={inputStyle}
      />
     {tagComma && <span style={{color:"red",fontSize:"10px",padding:"0",marginTop:"-1rem"}}>Do not end tags area with comma(,) or space[ ]</span>}
      </div>
      <MDEditor value={content} onChange={setContent} height={600}/>
      {/* Editor container */}
      {/* <div style={{overflowX: "hidden" }} ref={editorRef}></div> */}

      {/* Submit Button */}
      <div style={{ marginTop: "1rem",justifyContent:"center",alignContent:"center",display:"flex" }}>
     { (task=="create") && <button
          onClick={()=>handleupload()}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Upload
        </button>
        }
      {(task=="edit") && <button onClick={()=>handleedit()} style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}>Edit</button>}
      </div>
    </div>
  );
}
// Reusable input style
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "0.6rem",
  margin: "0.5rem 0",
  fontSize: "16px",
};

const des = `
## Introduction

Cryptocurrency, once a fringe concept, has now become a global financial force. Powered by **blockchain technology**, cryptocurrencies like Bitcoin and Ethereum are revolutionizing how we **store, transfer, and invest** money.

![Crypto Market](https://res.cloudinary.com/djruzbhto/image/upload/v1748691177/bitcoin_image-1.1700x960_goe4nl.jpg)

<span>This is an image of a dynamic crypto market visualization.</span>

## What is Cryptocurrency?

At its core, a cryptocurrency is a **digital or virtual currency** secured by cryptography, making it nearly **impossible to counterfeit or double-spend**.

### Key Characteristics:

- Decentralized (not controlled by any government or bank)
- Built on blockchain (transparent and immutable)
- Anonymous and secure

> “Bitcoin is a technological tour de force.” – Bill Gates

### Popular Cryptocurrencies

| Name       | Symbol | Purpose                 |
|------------|--------|-------------------------|
| Bitcoin    | BTC    | Digital gold/store of value |
| Ethereum   | ETH    | Smart contracts & dApps |
| Tether     | USDT   | Stablecoin pegged to USD |
| Solana     | SOL    | High-speed blockchain    |

## How Blockchain Works

Blockchain is a **distributed ledger** where transactions are recorded in blocks and linked using cryptography.

### Benefits:
- Tamper-proof
- Transparent
- Decentralized

\`\`\`js
// Example: Simulating a blockchain hash
const crypto = require('crypto');
const data = "Transaction data";
const hash = crypto.createHash('sha256').update(data).digest('hex');
console.log(hash);
\`\`\`

## Use Cases of Cryptocurrency

### 1. Digital Payments

Crypto enables **instant international payments** without high banking fees.

- Send money in seconds
- No need for intermediaries
- Low transaction fees

### 2. Investment and Trading

Cryptocurrencies are a popular **investment vehicle** due to their high volatility and growth potential.

- Platforms like Binance, Coinbase allow global trading
- Millions invest in crypto as digital assets

### 3. NFTs and Web3

Cryptocurrency fuels the **NFT (Non-Fungible Token)** and **Web3** ecosystem.

- Artists sell digital art via NFTs
- Decentralized apps (dApps) are powered by tokens

## Challenges in Crypto

1. **Regulatory Uncertainty**: Governments are still figuring out how to regulate crypto.
2. **Volatility**: Prices can swing wildly in minutes.
3. **Security**: Hacks and scams are common.
4. **Environmental Impact**: Mining consumes a lot of energy.

## Crypto Wallets

A **crypto wallet** is a digital tool that lets users store and manage their crypto assets.

### Types:

- **Hot Wallets** (e.g., MetaMask): Internet-connected
- **Cold Wallets** (e.g., Ledger): Offline for better security

> “Not your keys, not your coins.” – Crypto Community Saying

## Future of Cryptocurrency

The future is bright for crypto, with adoption growing across industries:

- Central Bank Digital Currencies (CBDCs)
- Crypto credit cards
- Blockchain voting systems
- Smart cities with tokenized economies

## Conclusion

Cryptocurrency is much more than a buzzword. It’s **redefining finance, ownership, and trust** in the digital age. But with great power comes great responsibility. As we embrace the decentralized world, we must tread carefully — respecting both the opportunities and the risks it brings.

#### “Crypto is not just money — it’s a movement.”

## Further Reading

- [CoinMarketCap](https://coinmarketcap.com)
- [Blockchain.com](https://www.blockchain.com)
- [OpenAI on AI and Crypto](https://openai.com/research)

`;