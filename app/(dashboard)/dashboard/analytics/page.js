import Link from "next/link";
import { FaEye, FaHeart } from "react-icons/fa6";
import { getMyBlogs, getMyStats } from "@/app/actions/dashboard";
import styles from "@/app/components/dashboard/dashboard.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const [{ data: blogs = [] }, { data: stats }] = await Promise.all([
    getMyBlogs({}),
    getMyStats(),
  ]);

  const ranked = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));

  return (
    <>
      <h1 className={styles.pageTitle}>Analytics</h1>
      <p className={styles.pageSub}>Performance across your published posts.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Views",    value: stats?.totalViews ?? 0, kind: styles.statIconPink },
          { label: "Total Likes",    value: stats?.totalLikes ?? 0, kind: styles.statIconTeal },
          { label: "Published",      value: stats?.published ?? 0,  kind: styles.statIconAmber },
          { label: "Drafts",         value: stats?.drafts ?? 0,     kind: styles.statIconIndigo },
        ].map((s) => (
          <div key={s.label} className={`${styles.card} ${styles.cardPad}`} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div className={`${styles.statIcon} ${s.kind}`}>★</div>
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Top Posts by Views</h2>
        </div>
        <div className={styles.cardPad}>
          {ranked.length === 0 ? (
            <div className={styles.empty}>
              <p>No posts yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ranked.slice(0, 10).map((b) => (
                <Link key={b._id} href={`/blog/${b.slug}`} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0.5rem", borderRadius: "8px", textDecoration: "none", color: "inherit", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 50, height: 50, borderRadius: 8, overflow: "hidden", background: "var(--bg)", flexShrink: 0 }}>
                    {b.coverImageUrl && <img src={b.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</p>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      <span className={`${styles.statusPill} ${b.status === "published" ? styles.statusPublished : styles.statusDraft}`} style={{ marginRight: "0.5rem" }}>{b.status}</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FaEye /> {b.views || 0}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FaHeart /> {b.likes || 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
