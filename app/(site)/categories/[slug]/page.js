import Link from "next/link";
import { FaClock } from "react-icons/fa6";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const label = decoded.charAt(0).toUpperCase() + decoded.slice(1);
  return {
    title: `${label} – Nova Blogs`,
    description: `Articles in ${label} on Nova Blogs.`,
  };
}

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Page = async ({ params }) => {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  await dbConnect();

  const isRecent = slug.toLowerCase() === "recent";
  const filter = isRecent
    ? { status: "published" }
    : { category: slug, status: "published" };

  const blogs = JSON.parse(JSON.stringify(await BlogModel.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(60)
    .select("title slug coverImageUrl excerpt readingTime authorName authorUsername authorAvatar publishedAt")
    .lean()));

  const otherCats = (await BlogModel.distinct("category", { status: "published" })).filter(Boolean).slice(0, 10);

  const label = isRecent ? "Recent Articles" : (slug.charAt(0).toUpperCase() + slug.slice(1));

  return (
    <main className={styles.pageWrap}>
      <h1 className={styles.heading} style={{ textTransform: isRecent ? "none" : "capitalize" }}>{label}</h1>
      <p className={styles.subheading}>
        {blogs.length} article{blogs.length === 1 ? "" : "s"}
      </p>

      <div className={styles.chipsRow}>
        <Link href="/categories" className={styles.chip}>All</Link>
        <Link href="/categories/Recent" className={`${styles.chip} ${isRecent ? styles.chipActive : ""}`}>Recent</Link>
        {otherCats.map((c) => (
          <Link
            key={c}
            href={`/categories/${encodeURIComponent(c)}`}
            className={`${styles.chip} ${(!isRecent && c === slug) ? styles.chipActive : ""}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {blogs.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--site-text-muted)" }}>
          No articles in this category yet.
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
