import mongoose from 'mongoose';

const SocialsSchema = new mongoose.Schema(
  {
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false }
);

const UserScheme = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 280 },
    socials: { type: SocialsSchema, default: () => ({}) },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    liked: { type: [String], default: [] },
    readLater: { type: [String], default: [] },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserScheme);
export default UserModel;
