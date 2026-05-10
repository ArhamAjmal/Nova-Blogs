import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "MyBlogs" },
    blogSlug: { type: String, required: true, index: true },
    body: { type: String, required: true, maxlength: 2000 },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },

    authorId: { type: String, required: true, index: true },
    authorUsername: { type: String, default: "" },
    authorName: { type: String, default: "" },
    authorAvatar: { type: String, default: "" },

    claps: { type: [String], default: [] },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ blogSlug: 1, createdAt: -1 });

const CommentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default CommentModel;
