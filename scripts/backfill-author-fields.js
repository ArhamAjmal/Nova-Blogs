/* eslint-disable no-console */
/**
 * One-shot, idempotent. Copies the current avatarUrl / displayName / username
 * from each User into the authorAvatar / authorName / authorUsername fields of
 * all their blogs.
 *
 *   node scripts/backfill-author-fields.js
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

  const users = await User.find(
    {},
    { projection: { clerkId: 1, username: 1, displayName: 1, avatarUrl: 1 } }
  ).toArray();

  let touched = 0;
  for (const u of users) {
    if (!u.clerkId) continue;
    const set = {
      authorUsername: u.username || "",
      authorName: u.displayName || u.username || "",
      authorAvatar: u.avatarUrl || "",
    };
    const result = await Blog.updateMany({ authorId: u.clerkId }, { $set: set });
    console.log(`@${u.username}: matched ${result.matchedCount}, updated ${result.modifiedCount}`);
    touched += result.modifiedCount;
  }

  console.log(`\ndone. ${touched} blog rows updated.`);
  await mongoose.disconnect();
};
main().catch(e => { console.error(e); process.exit(1); });
