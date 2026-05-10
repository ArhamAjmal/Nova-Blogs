"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTwitter, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa6";
import styles from "./dashboard.module.css";
import { useToast } from "./Toaster";
import { updateProfile } from "@/app/actions/dashboard";

const SettingsForm = ({ profile }) => {
  const r = useRouter();
  const toast = useToast();

  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [twitter, setTwitter] = useState(profile.socials?.twitter || "");
  const [github, setGithub] = useState(profile.socials?.github || "");
  const [linkedin, setLinkedin] = useState(profile.socials?.linkedin || "");
  const [website, setWebsite] = useState(profile.socials?.website || "");
  const [busy, setBusy] = useState(false);

  const onSave = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const res = await updateProfile({
      displayName: displayName.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      socials: {
        twitter: twitter.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        website: website.trim(),
      },
    });
    setBusy(false);
    if (!res.success) {
      toast.push(res.data || "Could not save.", "error");
      return;
    }
    toast.push("Profile updated.", "success");
    r.refresh();
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Settings</h1>
      <p className={styles.pageSub}>Your public profile and identity on Nova Blogs.</p>

      <form onSubmit={onSave} className={`${styles.card} ${styles.cardPad}`} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "640px" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--border)" }} />
          )}
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <label className={styles.fieldLabel}>Avatar URL</label>
            <input className={styles.fieldInput} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Display Name</label>
          <input className={styles.fieldInput} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Username</label>
          <input
            className={styles.fieldInput}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder="lowercase, letters/numbers/underscore"
          />
          <p className={styles.fieldHelp}>Your public profile lives at /u/{username || "username"}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Bio</label>
          <textarea
            className={styles.fieldTextarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short tagline. Up to 280 characters."
            rows={3}
            maxLength={280}
          />
          <p className={styles.fieldHelp}>{bio.length} / 280</p>
        </div>

        <h2 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "0.5rem" }}>
          Social Links
        </h2>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}><FaTwitter /> Twitter</label>
          <input className={styles.fieldInput} value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/…" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}><FaGithub /> GitHub</label>
          <input className={styles.fieldInput} value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/…" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}><FaLinkedin /> LinkedIn</label>
          <input className={styles.fieldInput} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}><FaGlobe /> Website</label>
          <input className={styles.fieldInput} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourdomain.com" />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button type="submit" className={styles.btnPrimary} disabled={busy}>
            {busy ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SettingsForm;
