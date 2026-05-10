"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaHeart, FaPen, FaTrash, FaPlus } from "react-icons/fa6";
import styles from "./dashboard.module.css";
import { useToast } from "./Toaster";
import { deleteBlog } from "@/app/actions/deleteBlog";

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const Card = ({ blog, onDelete }) => (
  <div className={styles.blogCard}>
    {blog.coverImageUrl ? (
      <img src={blog.coverImageUrl} alt={blog.title} className={styles.blogCover} />
    ) : (
      <div className={styles.blogCover} />
    )}
    <div className={styles.blogBody}>
      <span className={`${styles.statusPill} ${blog.status === "published" ? styles.statusPublished : styles.statusDraft}`}>
        {blog.status || "draft"}
      </span>
      <h3 className={styles.blogTitle}>{blog.title || "Untitled"}</h3>
      <div className={styles.blogMeta}>
        <span>{formatDate(blog.updatedAt || blog.createdAt)}</span>
        <span className={styles.blogMetaItem}><FaEye /> {blog.views || 0}</span>
        <span className={styles.blogMetaItem}><FaHeart /> {blog.likes || 0}</span>
      </div>
    </div>
    <div className={styles.blogActions}>
      {blog.status === "published" && (
        <Link href={`/blog/${blog.slug}`} className={styles.iconBtn} title="View">
          <FaEye size={13} />
        </Link>
      )}
      <Link href={`/dashboard/blogs/${blog.slug}/edit`} className={styles.iconBtn} title="Edit">
        <FaPen size={13} />
      </Link>
      <button onClick={() => onDelete(blog)} className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Delete">
        <FaTrash size={13} />
      </button>
    </div>
  </div>
);

const BlogList = ({ initialPublished = [], initialDrafts = [] }) => {
  const [tab, setTab] = useState("published");
  const [published, setPublished] = useState(initialPublished);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [busy, setBusy] = useState(null);
  const r = useRouter();
  const toast = useToast();

  const onDelete = async (blog) => {
    if (busy) return;
    if (!confirm(`Delete "${blog.title || blog.slug}"? This cannot be undone.`)) return;
    setBusy(blog._id);
    const ok = await deleteBlog(blog.slug);
    setBusy(null);
    if (!ok) {
      toast.push("Could not delete blog.", "error");
      return;
    }
    setPublished((xs) => xs.filter((b) => b._id !== blog._id));
    setDrafts((xs) => xs.filter((b) => b._id !== blog._id));
    toast.push("Blog deleted.", "success");
    r.refresh();
  };

  const list = tab === "published" ? published : tab === "drafts" ? drafts : [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h1 className={styles.pageTitle}>My Blogs</h1>
          <p className={styles.pageSub}>Manage your posts, drafts, and activity.</p>
        </div>
        <Link href="/dashboard/blogs/new" className={styles.btnPrimary}>
          <FaPlus /> New Blog
        </Link>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === "published" ? styles.tabActive : ""}`} onClick={() => setTab("published")}>
          Published <span style={{ opacity: 0.6 }}>({published.length})</span>
        </button>
        <button className={`${styles.tab} ${tab === "drafts" ? styles.tabActive : ""}`} onClick={() => setTab("drafts")}>
          Drafts <span style={{ opacity: 0.6 }}>({drafts.length})</span>
        </button>
        <button className={`${styles.tab} ${tab === "activity" ? styles.tabActive : ""}`} onClick={() => setTab("activity")}>
          Activity
        </button>
      </div>

      {tab === "activity" ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Activity feed coming soon</p>
          <p>You&apos;ll see likes, comments, and follows here.</p>
        </div>
      ) : list.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{tab === "drafts" ? "No drafts yet" : "No published posts yet"}</p>
          <p>
            <Link href="/dashboard/blogs/new" className={styles.btnPrimary} style={{ marginTop: "0.75rem" }}>
              <FaPlus /> New Blog
            </Link>
          </p>
        </div>
      ) : (
        <div className={styles.blogGrid}>
          {list.map((b) => <Card key={b._id} blog={b} onDelete={onDelete} />)}
        </div>
      )}
    </>
  );
};

export default BlogList;
