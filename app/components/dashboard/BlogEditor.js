"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaArrowLeft, FaEye } from "react-icons/fa6";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import styles from "./dashboard.module.css";
import { useToast } from "./Toaster";
import uploadBlog from "@/app/actions/uploadBlog";
import editBlog from "@/app/actions/editBlog";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const SLUG_RE = /^[a-z0-9-]+$/;
const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const BlogEditor = ({ mode, blog, session }) => {
  const r = useRouter();
  const toast = useToast();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.description || "");
  const [category, setCategory] = useState(blog?.category || "");
  const [tags, setTags] = useState((blog?.tags || []).join(", "));
  const [slug, setSlug] = useState(blog?.slug || "");
  const [coverImageUrl, setCoverImageUrl] = useState(blog?.coverImageUrl || "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "");
  const [status, setStatus] = useState(blog?.status || "draft");
  const [savedAt, setSavedAt] = useState(null);
  const [busy, setBusy] = useState(false);

  const authorName = blog?.author || session?.profile?.displayName || session?.fullName || "";

  const slugAuto = useMemo(() => (slug ? slug : slugify(title)), [slug, title]);

  const validate = (publishing) => {
    if (!title.trim()) return "Title is required.";
    if (!content.trim()) return "Content cannot be empty.";
    const s = (slug || slugify(title)).trim();
    if (!s) return "Slug is required.";
    if (!SLUG_RE.test(s)) return "Slug can only contain a–z, 0–9, and hyphens.";
    if (publishing) {
      if (!category.trim()) return "Category is required to publish.";
      if (/\s/.test(category)) return "Category can't contain spaces (use hyphens).";
      if (!coverImageUrl.trim()) return "Cover image URL is required to publish.";
    }
    return null;
  };

  const buildPayload = (overrideStatus) => {
    const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const finalSlug = (slug || slugify(title)).trim();
    return {
      title: title.trim(),
      category: category.trim(),
      description: content,
      tags: tagArr,
      slug: finalSlug,
      coverImageUrl: coverImageUrl.trim(),
      author: authorName,
      excerpt: excerpt.trim(),
      status: overrideStatus || status,
    };
  };

  const handleSave = async (publishing) => {
    if (busy) return;
    const intendedStatus = publishing ? "published" : "draft";
    const err = validate(publishing);
    if (err) { toast.push(err, "error"); return; }

    try {
      await serialize(content, { mdxOptions: { remarkPlugins: [remarkGfm] } });
    } catch (e) {
      toast.push(`Markdown error: ${e?.message || e}`, "error");
      return;
    }

    setBusy(true);
    const payload = buildPayload(intendedStatus);
    const res = isEdit ? await editBlog(payload) : await uploadBlog(payload);
    setBusy(false);

    if (!res?.success) {
      toast.push(res?.data || "Save failed.", "error");
      return;
    }

    setStatus(intendedStatus);
    setSavedAt(new Date());
    toast.push(publishing ? "Published." : "Draft saved.", "success");

    if (!isEdit) {
      r.replace(`/dashboard/blogs/${payload.slug}/edit`);
      return;
    }
    r.refresh();
  };

  const savedLabel = savedAt
    ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : isEdit ? "Unsaved changes" : "New draft";

  return (
    <>
      <div className={styles.editorTop}>
        <Link href="/dashboard/blogs" className={styles.btnGhost}>
          <FaArrowLeft /> Back
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{savedLabel}</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {isEdit && status === "published" && (
            <Link href={`/blog/${blog.slug}`} target="_blank" className={styles.btnGhost}>
              <FaEye /> Preview
            </Link>
          )}
          <button
            className={styles.btnGhost}
            disabled={busy}
            onClick={() => handleSave(false)}
          >
            Save Draft
          </button>
          <button
            className={styles.btnPrimary}
            disabled={busy}
            onClick={() => handleSave(true)}
          >
            {status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className={styles.editorBody}>
        <div className={styles.editorMain}>
          <input
            type="text"
            className={styles.editorTitleInput}
            placeholder="Untitled post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <MDEditor value={content} onChange={(v) => setContent(v || "")} height={520} />
        </div>

        <aside className={styles.editorRail}>
          <div className={`${styles.card} ${styles.cardPad}`}>
            <h3 className={styles.cardTitle} style={{ marginBottom: "0.85rem" }}>Post Settings</h3>

            <div className={styles.fieldGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.fieldLabel}>Category</label>
              <input
                className={styles.fieldInput}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. technology"
              />
              <p className={styles.fieldHelp}>One word, no spaces.</p>
            </div>

            <div className={styles.fieldGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.fieldLabel}>Tags</label>
              <input
                className={styles.fieldInput}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, web3, future"
              />
              <p className={styles.fieldHelp}>Comma-separated.</p>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Cover Image URL</label>
              <input
                className={styles.fieldInput}
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://…"
              />
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="cover preview"
                  style={{ width: "100%", borderRadius: "8px", marginTop: "0.5rem", maxHeight: "150px", objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardPad}`}>
            <h3 className={styles.cardTitle} style={{ marginBottom: "0.85rem" }}>SEO Settings</h3>

            <div className={styles.fieldGroup} style={{ marginBottom: "0.85rem" }}>
              <label className={styles.fieldLabel}>URL Slug</label>
              <input
                className={styles.fieldInput}
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder={slugAuto || "url-slug"}
                disabled={isEdit}
              />
              <p className={styles.fieldHelp}>
                {isEdit ? "Slug can't be changed after publishing." : `Auto from title: ${slugAuto || "—"}`}
              </p>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Meta Description</label>
              <textarea
                className={styles.fieldTextarea}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary for search engines and previews."
                rows={3}
                maxLength={200}
              />
              <p className={styles.fieldHelp}>{excerpt.length} / 200</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default BlogEditor;
