import Link from "next/link";
import { FaClock, FaHashtag } from "react-icons/fa6";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tags – Nova Blogs",
  description: "Browse articles by tag.",
  robots: { index: false, follow: false },
};

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Page = async ({ searchParams }) => {
  const sp = await searchParams;
  const selected = (sp?.selected && sp.selected !== "empty" ? sp.selected : "").split(",").filter(Boolean);
  await dbConnect();

  const allTags = (await BlogModel.distinct("tags", { status: "published" }))
    .filter(Boolean)
    .sort()
    .slice(0, 60);

  const blogs = selected.length
    ? JSON.parse(JSON.stringify(await BlogModel.find({
        tags: { $in: selected },
        status: "published",
      })
        .sort({ publishedAt: -1 })
        .limit(40)
        .select("title slug coverImageUrl excerpt readingTime authorName authorAvatar publishedAt")
        .lean()))
    : [];

  const toggleHref = (tag) => {
    const set = new Set(selected);
    if (set.has(tag)) set.delete(tag);
    else set.add(tag);
    const v = [...set].join(",");
    return v ? `/tags?selected=${encodeURIComponent(v)}` : "/tags";
  };

  return (
    <main className={styles.pageWrap}>
      <h1 className={styles.heading} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <FaHashtag /> Tags
      </h1>
      <p className={styles.subheading}>
        Pick one or more tags to browse matching articles.
      </p>

      <div className={styles.chipsRow}>
        {allTags.length === 0 && <span style={{ color: "var(--site-text-muted)" }}>No tags yet.</span>}
        {allTags.map((t) => {
          const active = selected.includes(t);
          return (
            <Link key={t} href={toggleHref(t)} className={`${styles.chip} ${active ? styles.chipActive : ""}`}>
              #{t}
            </Link>
          );
        })}
      </div>

      {selected.length === 0 ? (
        <div style={{ padding: "2rem 0", color: "var(--site-text-muted)" }}>
          Select a tag above to see articles.
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--site-text-muted)" }}>
          No articles match the selected tags.
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {blogs.map((b) => (
            <Link key={b._id} href={`/blog/${b.slug}`} className={styles.articleCard}>
              {b.coverImageUrl
                ? <img src={b.coverImageUrl} alt={b.title} className={styles.articleCardCover} />
                : <div className={styles.articleCardCover} />}
              <div className={styles.articleCardBody}>
                <h3>{b.title}</h3>
                {b.excerpt && <p>{b.excerpt}</p>}
                <div className={styles.cardFooter}>
                  <span className={styles.authorPill}>
                    {b.authorAvatar
                      ? <img src={b.authorAvatar} alt={b.authorName || ""} />
                      : <span className={styles.authorAvatar} />}
                    <span>{b.authorName || "Anonymous"}</span>
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
    </main>
  );
};

export default Page;
