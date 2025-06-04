'use client'; // if using App Router
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // use 'next/router' for Pages Router
import { HiOutlineSearch } from 'react-icons/hi';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import styles from './allblogs.module.css'
import Suggestions from './Suggestions';

const NavBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setsuggestions] = useState([])
  const [sugestionsL, setsugestionsL] = useState(true)
  const [open, setOpen] = useState(false);//isi boolean ki base me hum alert ko visible or invisible kren ge
  const modalRef = useRef(null);
  const router = useRouter();
  const inputref = useRef()
  useEffect(() => {
    
  const saved = localStorage.getItem("queries");
  const parsed = saved ? JSON.parse(saved) : [];
  setsuggestions(parsed);
  setsugestionsL(parsed.length > 0);
    console.log("op",localStorage.getItem("queries"))
  }, [])
   useEffect(() => {

      localStorage.setItem("queries", JSON.stringify(suggestions));
      if(suggestions.length==0)setsugestionsL(false)
      else setsugestionsL(true)
  }, [suggestions])
  
   const handleSearch = (e) => {//on click search
    setOpen(false)
    inputref.current?.blur()
    e.preventDefault();
    if (!query.trim()) return;
    else{
        //console.log("Result:",encodeURIComponent(query))
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    //saving search to local storage
    let searches = suggestions || [];

    searches = searches.filter(item => item !== query.trim());// Remove if already exists
      searches.unshift(query.trim()); // Add to beginning
     if (searches.length > 5) {// Keep only 5
       searches = searches.slice(0, 5);
     }
    //  localStorage.setItem("queries", JSON.stringify(searches));
    setsuggestions(searches)
     setsuggestions(searches)
    // console.log("GEt items:::",localStorage.getItem("queries"))
  };

  const handleInputChange = (e) => {//suggessions update
    const value = e.target.value;
    //const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
    setQuery(value);
    //console.log(value)
    /*/ Filter mock data - replace with real API call if needed
    if (value.trim()) {
      const filtered = mockSuggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }*/
  };

  const router2 = useRouter();
    const handleClickLogo = () => {
      router2.push('/');
    };
 
  return (
    <div className={styles.maincon}>
      <div className={styles.clerkb}>
      <SignedIn>
        <UserButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button className={styles.sighin}>Sign in</button>
        </SignInButton>
      </SignedOut>
      </div>

<div onClick={handleClickLogo} className={styles.logo} style={{ fontFamily: "'Times New Roman', Times, serif" }}>Nova Blogs</div>
    <div className={styles.navdiv}>
    <ul >
      <li ><Link href="/home">Home</Link></li>
      {/* <li><Link href="/allblogs">AllBlogs</Link></li> */}
      <li><Link href="/categories">Categories</Link></li>
      {/* <li><Link href="/tags">Tags#</Link></li> */}
      <li><Link href="/aboutus">About</Link></li>
      <li><Link href="/likedBlogs">Liked Blogs</Link></li>
    </ul>

    <div className={styles.sbar}>
      <form onSubmit={handleSearch} >
      <input
        ref={inputref}
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleInputChange}
        onFocus={()=>setOpen(true)}
        onBlur={()=>setOpen(false)}
      />
      <button type="submit">
        <HiOutlineSearch/>
      </button>
       </form>
       
       {(open && !query && sugestionsL) && <Suggestions ref={modalRef} suggestions={suggestions|| []} iref={inputref}/>}
      </div>
      
    </div>
    </div>
  )
}

export default NavBar
