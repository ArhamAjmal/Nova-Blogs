/* eslint-disable no-console */
/**
 * One-shot ownership audit. Prints, per blog:
 *   slug, status, displayed author text, authorId, → matched user @username
 *
 *   node scripts/diagnose-ownership.js
 */

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) { console.error("MONGODB_URI required"); process.exit(1); }

const main = async () => {
  await mongoose.connect(MONGODB_URI);

  const Blog = mongoose.connection.collection("myblogs");
  const User = mongoose.connection.collection("users");

  const users = await User.find({}, { projection: { clerkId: 1, username: 1, email: 1 } }).toArray();
  const byClerk = new Map(users.map(u => [u.clerkId, u]));

  const blogs = await Blog.find({}, {
    projection: { slug: 1, status: 1, author: 1, authorId: 1, authorName: 1, authorUsername: 1, title: 1 }
  }).sort({ updatedAt: -1 }).toArray();

  console.log(`\n${blogs.length} blogs in DB\n`);
  console.log("authorId map:");
  for (const u of users) console.log(`  ${u.clerkId} → @${u.username} (${u.email})`);
  console.log("");

  for (const b of blogs) {
    const owner = byClerk.get(b.authorId);
    const ownerStr = owner ? `@${owner.username}` : (b.authorId ? `[unknown clerkId: ${b.authorId}]` : "[NO authorId]");
    console.log(
      `${b.status?.padEnd(10) || "(none)   "} ${(b.slug || "").padEnd(60)}  author="${b.author || ""}"  authorName="${b.authorName || ""}"  → ${ownerStr}`
    );
  }

  await mongoose.disconnect();
};
main().catch(e => { console.error(e); process.exit(1); });
