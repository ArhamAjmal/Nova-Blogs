"use server";

import dbConnect from "../lib/connect";
import BlogModel from "../lib/model";

const RICH_FIELDS = "title slug coverImageUrl excerpt category tags authorId authorName authorUsername authorAvatar readingTime publishedAt views likes";

const PER_AUTHOR_CAP = 4;

const balanceByAuthor = (blogs, cap) => {
  const seen = new Map();
  const out = [];
  for (const b of blogs) {
    const key = b.authorId || "_anon";
    const c = seen.get(key) || 0;
    if (c < cap) {
      out.push(b);
      seen.set(key, c + 1);
    }
  }
  return out;
};

const getHomeFeed = async () => {
  await dbConnect();

  const recentRaw = await BlogModel.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(60)
    .select(RICH_FIELDS)
    .lean();

  const recent = balanceByAuthor(recentRaw, PER_AUTHOR_CAP).slice(0, 13);

  const trending = await BlogModel.find({ status: "published" })
    .sort({ views: -1, likes: -1 })
    .limit(15)
    .select(RICH_FIELDS)
    .lean();

  const categories = await BlogModel.distinct("category", { status: "published" });

  return {
    recent: JSON.parse(JSON.stringify(recent)),
    trending: JSON.parse(JSON.stringify(balanceByAuthor(trending, PER_AUTHOR_CAP).slice(0, 5))),
    categories: categories.filter(Boolean),
  };
};

export default getHomeFeed;
