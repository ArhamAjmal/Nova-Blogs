import mongoose from 'mongoose';

const blogscheme = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    tags: { type: [String], default: [] },
    slug: { type: String, required: true },
    coverImageUrl: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    shares: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },

    authorId: { type: String, required: true, index: true },
    authorUsername: { type: String, default: "", index: true },
    authorName: { type: String, default: "" },
    authorAvatar: { type: String, default: "" },

    author: { type: String, default: "" },
  },
  { timestamps: true }
);

blogscheme.index({ authorId: 1, slug: 1 }, { unique: true });
blogscheme.index({ status: 1, publishedAt: -1 });

const BlogModel = mongoose.models.MyBlogs || mongoose.model('MyBlogs', blogscheme);
export default BlogModel;
