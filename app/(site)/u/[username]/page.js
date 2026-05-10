import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin, FaGlobe, FaClock, FaHeart, FaEye } from "react-icons/fa6";
import NotFoundPage from "@/app/components/common/NotFoundPage";
import { getUserByUsername } from "@/app/actions/dashboard";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const res = await getUserByUsername(username);
  if (!res.success) return { title: "Profile not found" };
  const u = res.data.user;
  return {
    title: `${u.displayName || u.username} – Nova Blogs`,
    description: u.bio || `Posts by @${u.username} on Nova Blogs.`,
  };
}

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Page = async ({ params }) => {
  const { username } = await params;
  const res = await getUserByUsername(username);
  if (!res.success) return <NotFoundPage />;
  const { user, blogs } = res.data;
  const socials = user.socials || {};

  const totalViews = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const totalLikes = blogs.reduce((s, b) => s + (b.likes || 0), 0);

  return (
    <main className={styles.pageWrap}>
      <section style={{
        position: "relative",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
        borderRadius: "var(--site-radius)",
        padding: "3rem 2rem 2rem",
        color: "#fff",
        marginBottom: "2rem",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName || user.username}
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: "4px solid #fff",
                objectFit: "cover",
                marginBottom: "1rem",
              }}
            />
          ) : (
            <div style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              border: "4px solid #fff",
              background: "rgba(255,255,255,0.18)",
              margin: "0 auto 1rem",
            }} />
          )}
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 0.35rem" }}>
            {user.displayName || `@${user.username}`}
          </h1>
          <p style={{ opacity: 0.85, margin: "0 0 0.25rem" }}>@{user.username}</p>
          {user.bio && <p style={{ fontSize: "1rem", opacity: 0.95, maxWidth: 540, margin: "0.5rem auto 0" }}>{user.bio}</p>}

          <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", marginTop: "1.25rem" }}>
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" className={styles.footerSocial}><FaTwitter size={14} /></a>}
            {socials.github && <a href={socials.github} target="_blank" rel="noreferrer" className={styles.footerSocial}><FaGithub size={14} /></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className={styles.footerSocial}><FaLinkedin size={14} /></a>}
            {socials.website && <a href={socials.website} target="_blank" rel="noreferrer" className={styles.footerSocial}><FaGlobe size={14} /></a>}
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.18)",
          }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{blogs.length}</div>
              <div style={{ fontSize: "0.82rem", opacity: 0.85 }}>Posts</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{totalViews}</div>
              <div style={{ fontSize: "0.82rem", opacity: 0.85 }}>Views</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{totalLikes}</div>
              <div style={{ fontSize: "0.82rem", opacity: 0.85 }}>Likes</div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.gridSectionHead}>
        <h2>Articles</h2>
      </div>

      {blogs.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--site-text-muted)" }}>
          No published articles yet.
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {blogs.map((b) => (
            <Link key={b._id} href={`/blog/${b.slug}`} className={styles.articleCard}>
              {b.coverImageUrl
                ? <img src={b.coverImageUrl} alt={b.title} className={styles.articleCardCover} />
                : <div className={styles.articleCardCover} />}
              <div className={styles.articleCardBody}>
                {b.category && (
                  <span className={`${styles.categoryTag} ${styles.categoryTagLight}`}>{b.category}</span>
                )}
                <h3>{b.title}</h3>
                {b.excerpt && <p>{b.excerpt}</p>}
                <div className={styles.cardFooter}>
                  <span className={styles.metaRow}>
                    {fmtDate(b.publishedAt || b.createdAt)}
                  </span>
                  <span className={styles.metaRow}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FaEye size={11} /> {b.views || 0}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FaHeart size={11} /> {b.likes || 0}</span>
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
