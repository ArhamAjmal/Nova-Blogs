"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { FaHands, FaTrash, FaReply } from "react-icons/fa6";
import styles from "./article.module.css";
import {
  postComment,
  deleteComment,
  toggleClap,
} from "@/app/actions/comments";

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const months = Math.floor(d / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const Composer = ({ onSubmit, placeholder = "Share your thoughts…", autoFocus = false, onCancel, avatarUrl }) => {
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState(null);

  const submit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setError(null);
    start(async () => {
      const ok = await onSubmit(trimmed);
      if (ok === true) setBody("");
      else if (typeof ok === "string") setError(ok);
    });
  };

  return (
    <div className={styles.composer}>
      {avatarUrl
        ? <img src={avatarUrl} alt="" className={styles.composerAvatar} />
        : <div className={styles.composerAvatar} />}
      <div className={styles.composerBody}>
        <textarea
          className={styles.composerInput}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={2000}
          rows={3}
        />
        {error && <p style={{ color: "var(--danger, #ef4444)", fontSize: "0.85rem", margin: 0 }}>{error}</p>}
        <div className={styles.composerActions}>
          {onCancel && (
            <button type="button" className={styles.btnGhost} onClick={onCancel} disabled={pending}
              style={{ padding: "0.45rem 0.9rem", borderRadius: "999px", border: "1px solid var(--site-border)", background: "transparent", color: "var(--site-text-muted)", fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
          )}
          <button type="button" disabled={pending || !body.trim()} onClick={submit}
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "999px",
              border: 0,
              background: "var(--site-accent)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.88rem",
              cursor: pending || !body.trim() ? "not-allowed" : "pointer",
              opacity: pending || !body.trim() ? 0.6 : 1,
            }}>
            {pending ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ comment, isAuthorOfBlog, currentUserId, blogAuthorId, onUpdate, onDelete, onReplied }) => {
  const [replying, setReplying] = useState(false);
  const [pending, start] = useTransition();

  const isOwn = currentUserId && comment.authorId === currentUserId;
  const isCommenterTheAuthor = blogAuthorId && comment.authorId === blogAuthorId;
  const canDelete = isOwn || isAuthorOfBlog;

  const onClap = () => {
    if (!currentUserId) return;
    start(async () => {
      const r = await toggleClap(comment._id);
      if (r.success) onUpdate(r.data);
    });
  };

  const onDelClick = () => {
    if (!confirm("Delete this comment?")) return;
    start(async () => {
      const r = await deleteComment(comment._id);
      if (r.success) onDelete(comment._id);
    });
  };

  const handleReply = async (body) => {
    const r = await postComment({ slug: comment.blogSlug, body, parentId: comment._id });
    if (r.success) {
      onReplied(r.data);
      setReplying(false);
      return true;
    }
    return r.data;
  };

  return (
    <div className={styles.commentItem}>
      {comment.authorAvatar
        ? <img src={comment.authorAvatar} alt="" className={styles.commentAvatar} />
        : <div className={styles.commentAvatar} />}
      <div className={styles.commentBody}>
        <div className={styles.commentMeta}>
          <Link href={`/u/${comment.authorUsername}`} className={styles.commentName}>
            {comment.authorName || `@${comment.authorUsername}`}
          </Link>
          {isCommenterTheAuthor && <span className={styles.commentAuthorBadge}>Author</span>}
          <span className={styles.commentTime}>{timeAgo(comment.createdAt)}</span>
        </div>

        {comment.deleted
          ? <p className={styles.commentDeleted}>[deleted]</p>
          : <p className={styles.commentText}>{comment.body}</p>}

        <div className={styles.commentActions}>
          <button
            className={`${styles.commentBtn} ${comment.clapped ? styles.commentBtnClapped : ""}`}
            onClick={onClap}
            disabled={pending || !currentUserId}
            title={currentUserId ? (comment.clapped ? "Remove clap" : "Clap") : "Sign in to clap"}
          >
            <FaHands size={13} />
            <span>{comment.clapsCount || 0}</span>
          </button>
          {currentUserId && (
            <button className={styles.commentBtn} onClick={() => setReplying((r) => !r)}>
              <FaReply size={11} />
              <span>{replying ? "Cancel" : "Reply"}</span>
            </button>
          )}
          {canDelete && !comment.deleted && (
            <button className={`${styles.commentBtn} ${styles.commentBtnDanger}`} onClick={onDelClick} disabled={pending}>
              <FaTrash size={11} />
              <span>Delete</span>
            </button>
          )}
        </div>

        {replying && (
          <div className={styles.replyComposer}>
            <Composer onSubmit={handleReply} placeholder={`Reply to ${comment.authorName?.split(" ")[0] || "comment"}…`} autoFocus onCancel={() => setReplying(false)} />
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map((r) => (
              <Comment
                key={r._id}
                comment={r}
                isAuthorOfBlog={isAuthorOfBlog}
                currentUserId={currentUserId}
                blogAuthorId={blogAuthorId}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onReplied={onReplied}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Comments = ({ slug, initialComments = [], total = 0, blogAuthorId, isAuthorOfBlog }) => {
  const { user, isLoaded } = useUser();
  const [comments, setComments] = useState(initialComments);
  const [count, setCount] = useState(total);
  const [sort, setSort] = useState("newest");

  const currentUserId = user?.id || null;

  const sorted = useMemo(() => {
    const list = [...comments];
    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === "top") list.sort((a, b) => (b.clapsCount || 0) - (a.clapsCount || 0));
    else list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return list;
  }, [comments, sort]);

  const onSubmitTop = async (body) => {
    const r = await postComment({ slug, body, parentId: null });
    if (r.success) {
      setComments((c) => [{ ...r.data, replies: [] }, ...c]);
      setCount((n) => n + 1);
      return true;
    }
    return r.data;
  };

  const onUpdate = (patch) => {
    setComments((cs) =>
      cs.map((c) => {
        if (c._id === patch._id) return { ...c, ...patch };
        if (c.replies?.length) {
          return { ...c, replies: c.replies.map((r) => (r._id === patch._id ? { ...r, ...patch } : r)) };
        }
        return c;
      })
    );
  };

  const onDelete = (id) => {
    setComments((cs) =>
      cs
        .map((c) => {
          if (c._id === id) return { ...c, deleted: true, body: "" };
          if (c.replies?.length) {
            return { ...c, replies: c.replies.map((r) => (r._id === id ? { ...r, deleted: true, body: "" } : r)) };
          }
          return c;
        })
    );
    setCount((n) => Math.max(0, n - 1));
  };

  const onReplied = (newReply) => {
    setComments((cs) =>
      cs.map((c) =>
        String(c._id) === String(newReply.parentId)
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c
      )
    );
    setCount((n) => n + 1);
  };

  return (
    <section id="comments" className={styles.commentsSection}>
      <div className={styles.commentsHead}>
        <h2>
          Comments<span className={styles.commentsCount}>({count})</span>
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["newest", "oldest", "top"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              style={{
                background: sort === s ? "var(--site-accent-soft)" : "transparent",
                border: 0,
                color: sort === s ? "var(--site-accent)" : "var(--site-text-muted)",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoaded && (
        currentUserId
          ? <Composer onSubmit={onSubmitTop} avatarUrl={user?.imageUrl} />
          : (
            <div className={styles.composerSignedOut}>
              <SignInButton>
                <button style={{
                  background: "var(--site-accent)",
                  color: "#fff",
                  border: 0,
                  padding: "0.55rem 1.25rem",
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}>Sign in to join the discussion</button>
              </SignInButton>
            </div>
          )
      )}

      {sorted.length === 0 ? (
        <p style={{ color: "var(--site-text-muted)", textAlign: "center", padding: "1.5rem 0" }}>
          Be the first to comment.
        </p>
      ) : (
        <div className={styles.commentList}>
          {sorted.map((c) => (
            <Comment
              key={c._id}
              comment={c}
              isAuthorOfBlog={isAuthorOfBlog}
              currentUserId={currentUserId}
              blogAuthorId={blogAuthorId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReplied={onReplied}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Comments;
