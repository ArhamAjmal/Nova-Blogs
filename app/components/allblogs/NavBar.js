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
import Image from 'next/image';

const NavBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setsuggestions] = useState([])
  const [sugestionsL, setsugestionsL] = useState(true)
  const [open, setOpen] = useState(false);//isi boolean ki base me hum alert ko visible or invisible kren ge
  const modalRef = useRef(null);
  const router = useRouter();
  const inputref = useRef()
  //scroll sick
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentY > headerHeight) {
        if (currentY-5 > lastY) {
          setShowHeader(false); // scrolling down
        } else if (currentY+5 < lastY){
          setShowHeader(true); // scrolling up
        }
      } else {
        setShowHeader(true); // always show near top
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight]);

  useEffect(() => {
    
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem("queries");
      const parsed = Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : [];
      setsuggestions(parsed);
      setsugestionsL(parsed.length > 0);
    } catch (err) {
      console.error("Error reading suggestions from localStorage:", err);
      setsuggestions([]);
      setsugestionsL(false);
    }
  }
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
    <header ref={headerRef} className={`${styles.maincon} ${showHeader ? styles.show : styles.hide}`}>
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

<h1 onClick={handleClickLogo} className={styles.logo} style={{ fontFamily: "'Times New Roman', Times, serif" }}>Nova Blogs</h1>
    <nav className={styles.navdiv}>
    <ul >
      <li ><Link href="/home">
      <Image 
      height={100}
      width={100}
      src={'/house.png'}
      style={{height:"1.2rem",width:"1.2rem"}}
      />
      <span>Home</span>
      
      </Link></li>

      {/* <li><Link href="/allblogs">AllBlogs</Link></li> */}
      <li><Link href="/categories">
      <Image 
      height={100}
      width={100}
      src={'/categories.png'}
      style={{height:"1.2rem",width:"1.2rem"}}
      />
      <span>Categories</span>
      </Link></li>
      {/* <li><Link href="/tags">Tags#</Link></li> */}
      <li><Link href="/trending">
      <Image 
      height={100}
      width={100}
      src={'/trending2.png'}
      style={{height:"1.3rem",width:"1.35rem",marginRight:"-0.15rem"}}
      />
      <span>Trending</span>
      </Link></li>
      <li><Link href="/library">
      <Image 
      height={100}
      width={100}
      src={'/collection.png'}
      style={{height:"1.2rem",width:"1.2rem"}}
      />
      <span>Library</span>
      </Link></li>
      <li><Link href="/profile">
      <Image 
      height={100}
      width={100}
      src={'/user.png'}
      style={{height:"1.2rem",width:"1.2rem"}}
      />
      <span>Profile</span>
      </Link></li>
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
      
    </nav>
    </header>
  )
}

export default NavBar
