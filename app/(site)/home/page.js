import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { FaEye, FaClock, FaArrowRight } from "react-icons/fa6";
import UserSync from "@/app/components/common/UserSync";
import getHomeFeed from "@/app/actions/getHomeFeed";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Latest Blog Posts – Nova Blogs",
  description: "Discover the latest blogs on technology, innovation, healthcare, and more.",
  alternates: { canonical: "https://your-domain.com/home" },
  openGraph: {
    title: "Latest Blog Posts – Nova Blogs",
    description: "Explore top blogs on tech, AI, innovation, and healthcare.",
    type: "website",
  },
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const ArticleCard = ({ blog }) => (
  <Link href={`/blog/${blog.slug}`} className={styles.articleCard}>
    {blog.coverImageUrl ? (
      <img src={blog.coverImageUrl} alt={blog.title} className={styles.articleCardCover} />
    ) : (
      <div className={styles.articleCardCover} />
    )}
    <div className={styles.articleCardBody}>
      {blog.category && (
        <span className={`${styles.categoryTag} ${styles.categoryTagLight}`}>{blog.category}</span>
      )}
      <h3>{blog.title}</h3>
      {blog.excerpt && <p>{blog.excerpt}</p>}
      <div className={styles.cardFooter}>
        <span className={styles.authorPill}>
          {blog.authorAvatar
            ? <img src={blog.authorAvatar} alt={blog.authorName || ""} />
            : <span className={styles.authorAvatar} />}
          <span>{blog.authorName || blog.author || "Anonymous"}</span>
        </span>
        <span className={styles.metaRow}>
          {blog.readingTime ? <><FaClock size={11} /> {blog.readingTime} min</> : fmtDate(blog.publishedAt || blog.createdAt)}
        </span>
      </div>
    </div>
  </Link>
);

const SecondaryHero = ({ blog }) => (
  <Link href={`/blog/${blog.slug}`} className={styles.heroSecondary}>
    {blog.coverImageUrl ? (
      <img src={blog.coverImageUrl} alt={blog.title} />
    ) : (
      <div style={{ width: "40%", background: "var(--site-surface-alt)" }} />
    )}
    <div className={styles.heroSecondaryBody}>
      {blog.category && (
        <span className={`${styles.categoryTag} ${styles.categoryTagLight}`} style={{ marginBottom: "0.4rem" }}>
          {blog.category}
        </span>
      )}
      <h3>{blog.title}</h3>
      <div className={styles.metaRow} style={{ marginTop: "0.4rem" }}>
        <span>{blog.authorName || blog.author || "Anonymous"}</span>
        <span className={styles.metaDot} />
        <span>{fmtDate(blog.publishedAt || blog.createdAt)}</span>
      </div>
    </div>
  </Link>
);

const Page = async () => {
  const user = await currentUser();
  const { recent, trending, categories } = await getHomeFeed();

  const hero = recent[0];
  const sideHeroes = recent.slice(1, 3);
  const grid = recent.slice(3);
  const topCategories = categories.slice(0, 8);

  return (
    <main>
      {user && <UserSync />}

      <div className={styles.pageWrap}>
        {hero ? (
          <section className={styles.heroRow}>
            <Link href={`/blog/${hero.slug}`} className={styles.heroPrimary}>
              {hero.coverImageUrl && <img src={hero.coverImageUrl} alt={hero.title} />}
              <div className={styles.heroPrimaryBody}>
                {hero.category && <span className={styles.categoryTag}>{hero.category}</span>}
                <h2>{hero.title}</h2>
                {hero.excerpt && <p>{hero.excerpt}</p>}
                <div className={`${styles.metaRow} ${styles.metaLight}`}>
                  <span className={styles.authorPill}>
                    {hero.authorAvatar
                      ? <img src={hero.authorAvatar} alt={hero.authorName || ""} />
                      : <span className={styles.authorAvatar} />}
                    <span>{hero.authorName || hero.author || "Anonymous"}</span>
                  </span>
                  <span className={styles.metaDot} />
                  <span>{fmtDate(hero.publishedAt || hero.createdAt)}</span>
                  {hero.readingTime ? (
                    <>
                      <span className={styles.metaDot} />
                      <span><FaClock size={11} /> {hero.readingTime} min read</span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>

            <div className={styles.heroSide}>
              {sideHeroes.map((b) => <SecondaryHero key={b._id} blog={b} />)}
            </div>
          </section>
        ) : (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--site-text-muted)" }}>
            No published posts yet — be the first.
          </div>
        )}

        {topCategories.length > 0 && (
          <div className={styles.chipsRow}>
            <Link href="/home" className={`${styles.chip} ${styles.chipActive}`}>All</Link>
            {topCategories.map((c) => (
              <Link key={c} href={`/categories/${encodeURIComponent(c)}`} className={styles.chip}>
                {c}
              </Link>
            ))}
          </div>
        )}

        <div className={styles.gridSectionHead}>
          <h2>Latest Articles</h2>
          <Link href="/categories">
            Browse all <FaArrowRight size={11} />
          </Link>
        </div>
        <div className={styles.cardGrid}>
          {grid.map((b) => <ArticleCard key={b._id} blog={b} />)}
        </div>

        {trending.length > 0 && (
          <>
            <div className={styles.gridSectionHead} style={{ marginTop: "3rem" }}>
              <h2>Trending Now</h2>
              <Link href="/trending">View all <FaArrowRight size={11} /></Link>
            </div>
            <div className={styles.cardGridDense}>
              {trending.map((b) => (
                <Link key={b._id} href={`/blog/${b.slug}`} className={styles.articleCard}>
                  {b.coverImageUrl ? (
                    <img src={b.coverImageUrl} alt={b.title} className={styles.articleCardCover} style={{ height: 140 }} />
                  ) : (
                    <div className={styles.articleCardCover} style={{ height: 140 }} />
                  )}
                  <div className={styles.articleCardBody}>
                    <h3>{b.title}</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.metaRow}>
                        <FaEye size={11} /> {b.views || 0}
                      </span>
                      <span className={styles.metaRow}>
                        {fmtDate(b.publishedAt || b.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Page;
