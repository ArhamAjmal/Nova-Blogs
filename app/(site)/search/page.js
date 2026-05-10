import Link from "next/link";
import { FaClock, FaMagnifyingGlass } from "react-icons/fa6";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search – Nova Blogs",
  description: "Search articles on Nova Blogs.",
  robots: { index: false, follow: false },
};

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Page = async ({ searchParams }) => {
  const sp = await searchParams;
  const query = (sp?.q || "").trim();
  await dbConnect();

  const blogs = query
    ? JSON.parse(JSON.stringify(await BlogModel.find({
        title: { $regex: query, $options: "i" },
        status: "published",
      })
        .sort({ publishedAt: -1 })
        .limit(40)
        .select("title slug coverImageUrl excerpt readingTime authorName authorAvatar publishedAt")
        .lean()))
    : [];

  return (
    <main className={styles.pageWrap}>
      <h1 className={styles.heading}>
        {query ? <>Results for <em>&quot;{query}&quot;</em></> : "Search"}
      </h1>
      <p className={styles.subheading}>
        {query
          ? `${blogs.length} article${blogs.length === 1 ? "" : "s"} found`
          : "Use the search bar above to find articles."}
      </p>

      {query && blogs.length === 0 && (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--site-text-muted)" }}>
          <FaMagnifyingGlass size={28} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
          <p>No articles match your query. Try different keywords.</p>
        </div>
      )}

      {blogs.length > 0 && (
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
