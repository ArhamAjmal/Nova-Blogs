"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { FaMagnifyingGlass, FaPen, FaGauge, FaBars, FaXmark } from "react-icons/fa6";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const onSubmit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/search?q=${encodeURIComponent(v)}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button
          type="button"
          className={styles.menuToggle}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
        </button>

        <Link href="/" className={styles.brand}>
          <Image src="/logo.svg" alt="Nova Blogs" width={32} height={32} className={styles.brandLogo} priority />
          <span className={styles.brandText}>Nova Blogs</span>
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

      {menuOpen && (
        <nav className={styles.mobileNav}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
