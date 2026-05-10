import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FaTwitter, FaGithub, FaLinkedin, FaGlobe, FaPen, FaPlus, FaEye, FaHeart } from "react-icons/fa6";
import { getSessionUser } from "@/app/lib/auth";
import { getMyBlogs, getMyStats } from "@/app/actions/dashboard";
import styles from "@/app/components/dashboard/dashboard.module.css";

export const dynamic = "force-dynamic";

const StatRow = ({ kind, value, label }) => {
  const iconClass = {
    pink: styles.statIconPink,
    teal: styles.statIconTeal,
    amber: styles.statIconAmber,
    indigo: styles.statIconIndigo,
  }[kind];
  const symbol = { pink: "👁", teal: "❤", amber: "✎", indigo: "★" }[kind];
  return (
    <div className={styles.statRow}>
      <div className={`${styles.statIcon} ${iconClass}`}>{symbol}</div>
      <div>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
};

const PostCard = ({ blog }) => (
  <Link href={`/blog/${blog.slug}`} className={styles.blogCard}>
    {blog.coverImageUrl ? (
      <img src={blog.coverImageUrl} alt={blog.title} className={styles.blogCover} />
    ) : (
      <div className={styles.blogCover} />
    )}
    <div className={styles.blogBody}>
      <h3 className={styles.blogTitle}>{blog.title}</h3>
      <div className={styles.blogMeta}>
        <span className={styles.blogMetaItem}>
          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className={styles.blogMetaItem}><FaEye /> {blog.views || 0}</span>
        <span className={styles.blogMetaItem}><FaHeart /> {blog.likes || 0}</span>
      </div>
    </div>
  </Link>
);

const Page = async () => {
  const session = await getSessionUser();
  if (!session) redirect("/sign-in?redirect_url=/dashboard");
  const [{ data: blogs = [] }, { data: stats }] = await Promise.all([
    getMyBlogs({ status: "published" }),
    getMyStats(),
  ]);

  const profile = session.profile;
  const socials = profile.socials || {};
  const recent = blogs.slice(0, 6);

  return (
    <>
      <div className={styles.profileHero}>
        <div className={styles.heroBanner}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.displayName || profile.username} className={styles.heroAvatar} />
          ) : (
            <div className={styles.heroAvatar} />
          )}
          <h1 className={styles.heroName}>{profile.displayName || `@${profile.username}`}</h1>
          <p className={styles.heroBio}>{profile.bio || "Tell the world a little about yourself in Settings."}</p>
          <div className={styles.heroSocials}>
            {socials.twitter && <a className={styles.heroSocial} href={socials.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>}
            {socials.github && <a className={styles.heroSocial} href={socials.github} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {socials.linkedin && <a className={styles.heroSocial} href={socials.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>}
            {socials.website && <a className={styles.heroSocial} href={socials.website} target="_blank" rel="noreferrer"><FaGlobe /></a>}
          </div>
        </div>

        <div className={`${styles.card} ${styles.cardPad} ${styles.statsCard}`}>
          <h2 className={styles.cardTitle} style={{ marginBottom: "0.5rem" }}>Stats at a glance</h2>
          <StatRow kind="pink"   value={stats?.totalViews ?? 0}  label="Total Views" />
          <StatRow kind="teal"   value={stats?.totalLikes ?? 0}  label="Total Likes" />
          <StatRow kind="amber"  value={stats?.published ?? 0}   label="Published" />
          <StatRow kind="indigo" value={stats?.drafts ?? 0}      label="Drafts" />
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: "1rem" }}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Published Posts</h2>
          <Link href="/dashboard/blogs/new" className={styles.btnPrimary}>
            <FaPlus /> New Blog
          </Link>
        </div>
        <div className={styles.cardPad}>
          {recent.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No published posts yet</p>
              <p>Click <em>New Blog</em> to publish your first one.</p>
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {recent.map((b) => <PostCard key={b._id} blog={b} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
