"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FaBookOpenReader, FaUsers, FaGlobe, FaArrowRight, FaPen, FaGauge } from "react-icons/fa6";
import landing from "@/app/components/site/landing.module.css";
import SiteFooter from "@/app/components/site/SiteFooter";

export default function Home() {
  const r = useRouter();
  const [small, setSmall] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 750) {
      setSmall(true);
      r.push("/home");
    } else {
      setSmall(false);
    }
  }, []);

  if (small) return null;

  return (
    <div className={`site-theme ${landing.landing}`}>
      <header className={landing.landingHeader}>
        <Link href="/" className={landing.landingBrand}>
          <Image src="/logo.svg" alt="Nova Blogs" width={32} height={32} className={landing.landingBrandLogo} priority />
          <span>Nova Blogs</span>
        </Link>
        <nav className={landing.landingNav}>
          <Link href="/home">Articles</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/trending">Trending</Link>
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
              <a className={`${landing.landingPrimary}`} style={{ padding: "0.55rem 1rem", borderRadius: "999px", cursor: "pointer" }}>
                Sign in
              </a>
            </SignInButton>
          </SignedOut>
        </nav>
      </header>

      <section className={landing.hero}>
        <div className={landing.heroPattern} />
        <div className={landing.heroInner}>
          <span className={landing.heroEyebrow}>The home for thoughtful writing</span>
          <h1 className={landing.heroTitle}>
            Explore the future of <em>tech, ideas & culture</em>
          </h1>
          <p className={landing.heroSub}>
            Dive into cutting-edge insights, expert analysis, and a global community shaping the world of tomorrow.
          </p>
          <div className={landing.heroCtas}>
            <Link href="/home" className={landing.btnPrimary}>
              Start Reading <FaArrowRight size={12} />
            </Link>
            <SignedOut>
              <Link href="/sign-up" className={landing.btnGhost}>Join the Community</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard/blogs/new" className={landing.btnGhost}>Write a Blog</Link>
            </SignedIn>
          </div>
        </div>
      </section>

      <section className={landing.features}>
        <div className={landing.featureGrid}>
          <div className={landing.featureCard}>
            <div className={landing.featureIcon}><FaBookOpenReader /></div>
            <h3>Expert Insights</h3>
            <p>In-depth articles and reports from industry leaders shaping what comes next.</p>
          </div>
          <div className={landing.featureCard}>
            <div className={landing.featureIcon}><FaGlobe /></div>
            <h3>Curated Topics</h3>
            <p>Hand-picked content covering AI, tech, crypto, science, and the ideas that move them.</p>
          </div>
          <div className={landing.featureCard}>
            <div className={landing.featureIcon}><FaUsers /></div>
            <h3>Global Community</h3>
            <p>Connect with fellow enthusiasts, discuss the latest, and share knowledge.</p>
          </div>
        </div>
      </section>

      <section className={landing.ctaStrip}>
        <h2>Ready to share your ideas?</h2>
        <p>Anyone can publish on Nova Blogs. Spin up a draft in seconds.</p>
        <SignedIn>
          <Link href="/dashboard/blogs/new" className={landing.btnPrimary}>
            <FaPen size={12} /> Write your first blog
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-up" className={landing.btnPrimary}>
            Create your account <FaArrowRight size={12} />
          </Link>
        </SignedOut>
      </section>

      <SiteFooter />
    </div>
  );
}
