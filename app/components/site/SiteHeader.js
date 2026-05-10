"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { FaMagnifyingGlass, FaPen, FaGauge } from "react-icons/fa6";
import styles from "./site.module.css";

const NAV = [
  { href: "/home", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/trending", label: "Trending" },
  { href: "/tags", label: "Tags" },
];

const SiteHeader = () => {
  const router = useRouter();
  const pathname = usePathname() || "";
  const [q, setQ] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/search?q=${encodeURIComponent(v)}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandDot}>N</span>
          <span>Nova Blogs</span>
        </Link>

        <nav className={styles.nav}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <span className={styles.spacer} />

        <form onSubmit={onSubmit} className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search articles…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaMagnifyingGlass size={14} />
          </button>
        </form>

        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link label="Dashboard" labelIcon={<FaGauge size={14} />} href="/dashboard" />
              <UserButton.Link label="Write a blog" labelIcon={<FaPen size={14} />} href="/dashboard/blogs/new" />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className={styles.signIn}>Sign in</button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};

export default SiteHeader;
