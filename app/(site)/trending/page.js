import Link from "next/link";
import { FaEye, FaHeart, FaClock, FaFire } from "react-icons/fa6";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trending – Nova Blogs",
  description: "The most-read articles right now.",
};

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Page = async () => {
  await dbConnect();
  const blogs = JSON.parse(JSON.stringify(await BlogModel.find({ status: "published" })
    .sort({ views: -1, likes: -1 })
    .limit(30)
    .select("title slug coverImageUrl excerpt readingTime authorName authorAvatar views likes publishedAt")
    .lean()));

  const top = blogs[0];
  const rest = blogs.slice(1);

  return (
    <main className={styles.pageWrap}>
      <h1 className={styles.heading} style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
        <FaFire color="#ef4444" /> Trending Now
      </h1>
      <p className={styles.subheading}>The articles capturing readers' attention this week.</p>

      {top && (
        <Link href={`/blog/${top.slug}`} className={styles.heroPrimary} style={{ display: "block", marginBottom: "2rem" }}>
          {top.coverImageUrl && <img src={top.coverImageUrl} alt={top.title} />}
          <div className={styles.heroPrimaryBody}>
            <span className={styles.categoryTag}>#1 Trending</span>
            <h2>{top.title}</h2>
            {top.excerpt && <p>{top.excerpt}</p>}
            <div className={`${styles.metaRow} ${styles.metaLight}`}>
              <span>{top.authorName || "Anonymous"}</span>
              <span className={styles.metaDot} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FaEye size={11} /> {top.views || 0}</span>
              <span className={styles.metaDot} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FaHeart size={11} /> {top.likes || 0}</span>
            </div>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className={styles.cardGrid}>
          {rest.map((b, i) => (
            <Link key={b._id} href={`/blog/${b.slug}`} className={styles.articleCard}>
              {b.coverImageUrl
                ? <img src={b.coverImageUrl} alt={b.title} className={styles.articleCardCover} />
                : <div className={styles.articleCardCover} />}
              <div className={styles.articleCardBody}>
                <span style={{
                  display: "inline-block",
                  width: "fit-content",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--site-text-muted)",
                  marginBottom: "0.4rem",
                }}>#{i + 2}</span>
                <h3>{b.title}</h3>
                {b.excerpt && <p>{b.excerpt}</p>}
                <div className={styles.cardFooter}>
                  <span className={styles.metaRow}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FaEye size={11} /> {b.views || 0}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FaHeart size={11} /> {b.likes || 0}</span>
                  </span>
                  <span className={styles.metaRow}>
                    {b.readingTime ? <><FaClock size={11} /> {b.readingTime} min</> : fmtDate(b.publishedAt || b.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {blogs.length === 0 && (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--site-text-muted)" }}>
          No published articles yet.
        </div>
      )}
    </main>
  );
};

export default Page;
