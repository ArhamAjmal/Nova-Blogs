"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { FaPen, FaChartBar, FaBookmark, FaGear, FaArrowRightFromBracket, FaHouse } from "react-icons/fa6";
import styles from "./dashboard.module.css";

const NAV = [
  { href: "/dashboard",          label: "Overview",  icon: FaHouse },
  { href: "/dashboard/blogs",    label: "My Blogs",  icon: FaPen },
  { href: "/dashboard/saved",    label: "Saved",     icon: FaBookmark },
  { href: "/dashboard/analytics",label: "Analytics", icon: FaChartBar },
  { href: "/dashboard/settings", label: "Settings",  icon: FaGear },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Image src="/logo.svg" alt="Nova Blogs" width={28} height={28} className={styles.brandLogo} />
        <span>Nova Blogs</span>
      </Link>

      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard"
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
          >
            <span className={styles.navIcon}><Icon /></span>
            <span>{label}</span>
          </Link>
        );
      })}

      <span className={styles.navSpacer} />

      <div className={styles.navFoot}>
        <SignOutButton redirectUrl="/">
          <button className={styles.navLink} style={{ width: "100%", background: "transparent", border: 0, color: "inherit", cursor: "pointer", textAlign: "left" }}>
            <span className={styles.navIcon}><FaArrowRightFromBracket /></span>
            <span>Logout</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
};

export default Sidebar;
