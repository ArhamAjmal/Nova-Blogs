/* eslint-disable no-console */
/**
 * Phase 1 migration — run once, idempotent. Supports up to N authors.
 *
 *   node scripts/migrate-phase1.js               # apply
 *   node scripts/migrate-phase1.js --dry-run     # preview only, no writes
 *
 * Required env:
 *   MONGODB_URI                  same as the app
 *   MIGRATION_AUTHORS            JSON array describing the legacy authors:
 *     [
 *       {
 *         "clerkId":     "user_xxx",
 *         "username":    "arham",
 *         "displayName": "Arham Ajmal",
 *         "email":       "arhamoajmal@gmail.com",
 *         "avatarUrl":   "",
 *         "match":       ["arham", "ajmal"]   // case-insensitive substrings of legacy `author` field
 *       },
 *       {
 *         "clerkId":     "user_yyy",
 *         "username":    "tuba",
 *         "displayName": "Tuba Arif",
 *         "email":       "tubaarif3905@gmail.com",
 *         "match":       ["tuba", "arif"]
 *       }
 *     ]
 *
 *   The FIRST author in the array is the default — any legacy blog whose `author`
 *   field doesn't match anyone gets attributed to them. Set "match": [] to skip
 *   matching entirely for an author.
 *
 * What it does:
 *   1. Ensures a User doc exists for every entry in MIGRATION_AUTHORS.
 *   2. For every blog missing authorId, runs the matcher against `author` and
 *      assigns to the first matching User; falls back to the first user otherwise.
 *   3. Stamps status="published" + publishedAt on legacy blogs.
 *   4. Builds excerpt + readingTime if missing.
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const mongoose = require("mongoose");

const { MONGODB_URI, MIGRATION_AUTHORS } = process.env;
const DRY = process.argv.includes("--dry-run");

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}
if (!MIGRATION_AUTHORS) {
  console.error("MIGRATION_AUTHORS env var is required (JSON array, see header)");
  process.exit(1);
}

let authors;
try {
  authors = JSON.parse(MIGRATION_AUTHORS);
} catch (e) {
  console.error("MIGRATION_AUTHORS is not valid JSON:", e.message);
  process.exit(1);
}
if (!Array.isArray(authors) || authors.length === 0) {
  console.error("MIGRATION_AUTHORS must be a non-empty JSON array");
  process.exit(1);
}
for (const [i, a] of authors.entries()) {
  if (!a.clerkId || !a.username || !a.email) {
    console.error(`MIGRATION_AUTHORS[${i}] needs clerkId, username, and email`);
    process.exit(1);
  }
  a.match = Array.isArray(a.match) ? a.match.map((s) => String(s).toLowerCase()) : [];
}

const SocialsSchema = new mongoose.Schema(
  { twitter: String, github: String, linkedin: String, website: String },
  { _id: false }
);
const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    displayName: String,
    avatarUrl: String,
    bio: { type: String, default: "" },
    socials: { type: SocialsSchema, default: () => ({}) },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    liked: { type: [String], default: [] },
    readLater: { type: [String], default: [] },
  },
  { timestamps: true }
);
const BlogSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    description: String,
    excerpt: String,
    tags: [String],
    slug: String,
    coverImageUrl: String,
    date: { type: Date, default: Date.now },
    shares: Number,
    likes: Number,
    views: Number,
    readingTime: Number,
    status: String,
    publishedAt: Date,
    authorId: String,
    authorUsername: String,
    authorName: String,
    authorAvatar: String,
    author: String,
  },
  { timestamps: true }
);

const buildExcerpt = (md) =>
  (md || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

const computeReadingTime = (md) => {
  const words = (md || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const matchAuthor = (legacyAuthor) => {
  const text = String(legacyAuthor || "").toLowerCase();
  for (const a of authors) {
    if (a.match.length === 0) continue;
    if (a.match.some((m) => text.includes(m))) return a;
  }
  return authors[0];
};

const main = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(`connected${DRY ? " (DRY RUN — no writes)" : ""}`);

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Blog = mongoose.models.MyBlogs || mongoose.model("MyBlogs", BlogSchema);

  // ── 1) ensure each User doc exists (merge legacy email-only docs) ─────────
  const userByClerkId = new Map();
  for (const a of authors) {
    let doc = await User.findOne({ clerkId: a.clerkId });

    if (!doc) {
      const legacy = await User.findOne({ email: a.email });
      if (legacy) {
        let username = legacy.username || a.username;
        if (!legacy.username) {
          let suffix = 0;
          while (await User.exists({ username })) {
            suffix += 1;
            username = `${a.username}${suffix}`;
          }
        }
        if (DRY) {
          console.log(`[dry] would merge legacy user (${a.email}) → clerkId=${a.clerkId}, @${username}`);
          doc = { ...legacy.toObject(), ...a, username };
        } else {
          legacy.clerkId = a.clerkId;
          legacy.username = username;
          if (!legacy.displayName) legacy.displayName = a.displayName || username;
          if (!legacy.avatarUrl && a.avatarUrl) legacy.avatarUrl = a.avatarUrl;
          legacy.role = "admin";
          await legacy.save();
          doc = legacy;
          console.log(`merged legacy user → @${username} (${a.email})`);
        }
      } else {
        let username = a.username;
        let suffix = 0;
        while (await User.exists({ username })) {
          suffix += 1;
          username = `${a.username}${suffix}`;
        }
        if (DRY) {
          console.log(`[dry] would create user @${username} (${a.email})`);
          doc = { ...a, username };
        } else {
          doc = await User.create({
            clerkId: a.clerkId,
            email: a.email,
            username,
            displayName: a.displayName || username,
            avatarUrl: a.avatarUrl || "",
            role: "admin",
          });
          console.log(`created user @${username}`);
        }
      }
    } else {
      console.log(`user found: @${doc.username} (${doc.email})`);
    }

    userByClerkId.set(a.clerkId, doc);
  }

  // ── 2) preview / backfill ─────────────────────────────────────────────────
  const cursor = Blog.find({
    $or: [{ authorId: { $exists: false } }, { authorId: null }, { authorId: "" }],
  }).cursor();

  const tally = new Map(authors.map((a) => [a.clerkId, 0]));
  let total = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    total += 1;
    const owner = matchAuthor(doc.author);
    const ownerDoc = userByClerkId.get(owner.clerkId);
    tally.set(owner.clerkId, (tally.get(owner.clerkId) || 0) + 1);

    if (DRY) {
      console.log(
        `[dry] "${doc.title || doc.slug}"  author="${doc.author || ""}"  →  @${ownerDoc.username}`
      );
      continue;
    }

    doc.authorId = owner.clerkId;
    doc.authorUsername = ownerDoc.username;
    doc.authorName = ownerDoc.displayName || owner.displayName || ownerDoc.username;
    doc.authorAvatar = ownerDoc.avatarUrl || "";
    if (!doc.author) doc.author = ownerDoc.displayName || ownerDoc.username;
    if (!doc.status) doc.status = "published";
    if (!doc.publishedAt) doc.publishedAt = doc.date || doc.createdAt || new Date();
    if (!doc.excerpt) doc.excerpt = buildExcerpt(doc.description);
    if (!doc.readingTime) doc.readingTime = computeReadingTime(doc.description);
    await doc.save({ validateBeforeSave: false });
  }

  console.log(`\n${DRY ? "would-attribute" : "attributed"} ${total} legacy blogs:`);
  for (const a of authors) {
    const u = userByClerkId.get(a.clerkId);
    console.log(`  @${u.username}: ${tally.get(a.clerkId) || 0}`);
  }

  // ── 3) patch any attributed-but-incomplete blogs (status / excerpt / time) ─
  if (!DRY) {
    const remainder = await Blog.find({
      authorId: { $exists: true, $ne: null, $ne: "" },
      $or: [
        { status: { $exists: false } },
        { excerpt: { $exists: false } },
        { readingTime: { $exists: false } },
      ],
    });
    for (const doc of remainder) {
      if (!doc.status) doc.status = "published";
      if (!doc.publishedAt) doc.publishedAt = doc.date || doc.createdAt || new Date();
      if (!doc.excerpt) doc.excerpt = buildExcerpt(doc.description);
      if (!doc.readingTime) doc.readingTime = computeReadingTime(doc.description);
      await doc.save({ validateBeforeSave: false });
    }
    console.log(`patched ${remainder.length} attributed-but-incomplete blogs`);
  }

  await mongoose.disconnect();
  console.log("done");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
