import Link from "next/link";
import { FaClock, FaEye } from "react-icons/fa6";
import fetchBlog from "@/app/actions/fetchBlog";
import { getSessionUser, isOwnerOrAdmin } from "@/app/lib/auth";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import UserModel from "@/app/lib/userModel";
import NotFoundPage from "@/app/components/common/NotFoundPage";
import ArticleBody from "@/app/components/site/ArticleBody";
import EngagementBar from "@/app/components/site/EngagementBar";
import Comments from "@/app/components/site/Comments";
import { listComments } from "@/app/actions/comments";
import styles from "@/app/components/site/article.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = await fetchBlog(slug);
  if (!r.success) return { title: "Article not found" };
  const b = r.data;
  return {
    title: `${b.title} – Nova Blogs`,
    description: b.excerpt || (b.description || "").slice(0, 150),
    openGraph: {
      title: b.title,
      description: b.excerpt || "",
      images: b.coverImageUrl ? [b.coverImageUrl] : [],
      type: "article",
      publishedTime: b.publishedAt,
      authors: b.authorName ? [b.authorName] : undefined,
    },
  };
}

const slugifyHeading = (s) =>
  String(s).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

const extractToc = (markdown) => {
  const lines = (markdown || "").split("\n");
  const toc = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[*_`~]/g, "").trim();
      if (text) toc.push({ level, text, id: slugifyHeading(text) });
    }
  }
  return toc;
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Page = async ({ params }) => {
  const { slug } = await params;

  const result = await fetchBlog(slug);
  if (!result.success) return <NotFoundPage />;
  const blog = result.data;

  await dbConnect();

  const session = await getSessionUser();
  const canEdit = isOwnerOrAdmin(session, blog);

  const userLiked = !!session?.profile?.liked?.includes(slug);
  const userSaved = !!session?.profile?.readLater?.includes(slug);

  const commentResult = await listComments(slug);
  const initialComments = commentResult.data?.comments || [];
  const commentTotal = commentResult.data?.total || 0;

  const tags = Array.isArray(blog.tags) ? blog.tags : [];
  const relatedQuery = tags.length
    ? { tags: { $in: tags }, slug: { $ne: slug }, status: "published" }
    : { authorId: blog.authorId, slug: { $ne: slug }, status: "published" };

  const related = JSON.parse(JSON.stringify(await BlogModel.find(relatedQuery)
    .sort({ publishedAt: -1 })
    .limit(6)
    .select("title slug coverImageUrl publishedAt readingTime authorName")
    .lean()));

  let authorProfile = null;
  if (blog.authorId) {
    authorProfile = JSON.parse(JSON.stringify(await UserModel.findOne({ clerkId: blog.authorId })
      .select("username displayName avatarUrl bio")
      .lean()));
  }

  const toc = extractToc(blog.description);

  return (
    <main className={styles.shell}>
      <header className={styles.heroBlock}>
        {blog.category && (
          <Link href={`/categories/${encodeURIComponent(blog.category)}`} className={styles.categoryPill}>
            {blog.category}
          </Link>
        )}
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.metaLine}>
          {authorProfile ? (
            <Link href={`/u/${authorProfile.username}`} className={styles.authorChip}>
              {authorProfile.avatarUrl
                ? <img src={authorProfile.avatarUrl} alt={authorProfile.displayName || ""} className={styles.authorAvatar} />
                : <span className={styles.authorAvatar} />}
              <span>{authorProfile.displayName || `@${authorProfile.username}`}</span>
            </Link>
          ) : (
            <span>{blog.authorName || blog.author || "Anonymous"}</span>
          )}
          <span className={styles.metaDot} />
          <span>{fmtDate(blog.publishedAt || blog.createdAt)}</span>
          {blog.readingTime ? (
            <>
              <span className={styles.metaDot} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <FaClock size={11} /> {blog.readingTime} min read
              </span>
            </>
          ) : null}
          {typeof blog.views === "number" && (
            <>
              <span className={styles.metaDot} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <FaEye size={11} /> {blog.views} views
              </span>
            </>
          )}
        </div>
      </header>

      {blog.coverImageUrl && (
        <figure className={styles.cover}>
          <img src={blog.coverImageUrl} alt={blog.title} />
        </figure>
      )}

      <div className={styles.layout}>
        <article className={styles.article}>
          <ArticleBody source={blog.description} slug={slug} />

          {tags.length > 0 && (
            <div className={styles.tagsRow}>
              {tags.map((t) => (
                <Link key={t} href={`/tags?selected=${encodeURIComponent(t)}`} className={styles.tagChip}>
                  #{t}
                </Link>
              ))}
            </div>
          )}

          <EngagementBar
            slug={slug}
            initialLikes={blog.likes || 0}
            initialLiked={userLiked}
            initialSaved={userSaved}
            commentCount={commentTotal}
            canEdit={canEdit}
          />

          {authorProfile && (
            <div className={styles.authorBlock}>
              {authorProfile.avatarUrl
                ? <img src={authorProfile.avatarUrl} alt={authorProfile.displayName || ""} />
                : <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--site-surface-alt)" }} />}
              <div className={styles.authorBlockBody}>
                <Link href={`/u/${authorProfile.username}`} className={styles.authorBlockName}>
                  {authorProfile.displayName || `@${authorProfile.username}`}
                </Link>
                {authorProfile.bio && <p className={styles.authorBlockBio}>{authorProfile.bio}</p>}
              </div>
            </div>
          )}

          <Comments
            slug={slug}
            initialComments={initialComments}
            total={commentTotal}
            blogAuthorId={blog.authorId}
            isAuthorOfBlog={canEdit}
          />
        </article>

        <aside className={styles.rail}>
          {toc.length > 1 && (
            <div className={styles.railCard}>
              <h3 className={styles.railTitle}>Table of Contents</h3>
              <ul className={styles.tocList}>
                {toc.map((h, i) => (
                  <li
                    key={i}
                    className={`${styles.tocItem} ${h.level === 3 ? styles.tocLevel3 : styles.tocLevel2}`}
                  >
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className={styles.railCard}>
              <h3 className={styles.railTitle}>Related Articles</h3>
              {related.slice(0, 3).map((r) => (
                <Link key={r._id} href={`/blog/${r.slug}`} className={styles.relatedItem}>
                  {r.coverImageUrl
                    ? <img src={r.coverImageUrl} alt={r.title} />
                    : <div style={{ width: 64, height: 64, borderRadius: 8, background: "var(--site-surface-alt)" }} />}
                  <div>
                    <p className={styles.relatedTitle}>{r.title}</p>
                    <p className={styles.relatedMeta}>
                      {r.readingTime ? `${r.readingTime} min read` : fmtDate(r.publishedAt || r.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className={`${styles.railCard} ${styles.newsletterCard}`}>
            <h3 className={styles.railTitle}>Newsletter</h3>
            <p>Get the latest articles delivered to your inbox.</p>
            <input type="email" placeholder="you@example.com" />
            <button type="button">Subscribe</button>
          </div>
        </aside>
      </div>

      {related.length > 3 && (
        <section className={styles.relatedRow}>
          <div className={styles.relatedRowHead}>
            <h2>More like this</h2>
            <Link href="/categories" style={{ color: "var(--site-accent)", fontSize: "0.9rem", textDecoration: "none" }}>
              Browse all
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.slice(3).map((r) => (
              <Link key={r._id} href={`/blog/${r.slug}`} style={{
                background: "var(--site-surface)",
                border: "1px solid var(--site-border)",
                borderRadius: "var(--site-radius)",
                padding: "0.85rem",
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}>
                {r.coverImageUrl && (
                  <img src={r.coverImageUrl} alt={r.title} style={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: "0.5rem",
                  }} />
                )}
                <p style={{ fontWeight: 600, fontSize: "0.95rem", margin: 0, lineHeight: 1.35 }}>{r.title}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--site-text-muted)", margin: "0.35rem 0 0" }}>
                  {fmtDate(r.publishedAt || r.createdAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Page;
