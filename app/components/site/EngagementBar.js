"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaComment,
  FaShareNodes,
  FaXTwitter,
  FaLinkedin,
  FaPen,
  FaTrash,
} from "react-icons/fa6";
import styles from "./article.module.css";
import { deleteBlog } from "@/app/actions/deleteBlog";

const EngagementBar = ({ slug, initialLikes, initialLiked, initialSaved, commentCount = 0, canEdit }) => {
  const { user } = useUser();
  const r = useRouter();
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(!!initialLiked);
  const [saved, setSaved] = useState(!!initialSaved);
  const [busy, setBusy] = useState(false);

  const requireAuth = () => {
    if (!user) {
      alert("Please sign in to interact.");
      return false;
    }
    return true;
  };

  const toggleLike = async () => {
    if (!requireAuth() || busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    try {
      await fetch(`/api/blogs/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: next ? "like" : "dislike" }),
      });
      await fetch(`/api/user/${user.primaryEmailAddress.emailAddress}`, {
        method: next ? "PUT" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "liked", slug }),
      });
    } finally {
      setBusy(false);
    }
  };

  const toggleSave = async () => {
    if (!requireAuth() || busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      await fetch(`/api/user/${user.primaryEmailAddress.emailAddress}`, {
        method: next ? "PUT" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "readLater", slug }),
      });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this blog? This cannot be undone.")) return;
    const ok = await deleteBlog(slug);
    if (ok) r.push("/home");
    else alert("Could not delete.");
  };

  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank", "noopener");
  const shareLinkedin = () => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
  const copyLink = async () => { try { await navigator.clipboard.writeText(url); } catch {} };

  return (
    <div className={styles.engagement}>
      <button onClick={toggleLike} className={`${styles.engageBtn} ${liked ? styles.engageBtnActive : ""}`}>
        {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        <span>{likes}</span>
      </button>
      <button onClick={toggleSave} className={`${styles.engageBtn} ${saved ? styles.engageBtnActive : ""}`}>
        {saved ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
      <a href="#comments" className={styles.engageBtn} title="Jump to comments">
        <FaComment size={13} />
        <span>{commentCount}</span>
      </a>

      <span className={styles.engageSpacer} />

      <div className={styles.shareGroup}>
        <button onClick={shareTwitter} className={styles.engageBtn} aria-label="Share on Twitter"><FaXTwitter size={14} /></button>
        <button onClick={shareLinkedin} className={styles.engageBtn} aria-label="Share on LinkedIn"><FaLinkedin size={14} /></button>
        <button onClick={copyLink} className={styles.engageBtn} aria-label="Copy link"><FaShareNodes size={14} /></button>
      </div>

      {canEdit && (
        <>
          <a href={`/dashboard/blogs/${slug}/edit`} className={styles.engageBtn} title="Edit">
            <FaPen size={12} /> Edit
          </a>
          <button onClick={onDelete} className={styles.engageBtn} title="Delete" style={{ color: "var(--site-text-muted)" }}>
            <FaTrash size={12} />
          </button>
        </>
      )}
    </div>
  );
};

export default EngagementBar;
