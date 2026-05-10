import Link from "next/link";
import { redirect } from "next/navigation";
import { FaBookmark } from "react-icons/fa6";
import { getSessionUser } from "@/app/lib/auth";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import styles from "@/app/components/dashboard/dashboard.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getSessionUser();
  if (!session) redirect("/sign-in?redirect_url=/dashboard/saved");
  await dbConnect();
  const slugs = session.profile.readLater || [];
  const blogs = slugs.length
    ? JSON.parse(JSON.stringify(await BlogModel.find({ slug: { $in: slugs }, status: "published" }).lean()))
    : [];

  return (
    <>
      <h1 className={styles.pageTitle}>Saved</h1>
      <p className={styles.pageSub}>Posts you've saved to read later.</p>

      {blogs.length === 0 ? (
        <div className={styles.empty}>
          <FaBookmark size={28} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
          <p className={styles.emptyTitle}>Nothing saved yet</p>
          <p>Tap the bookmark icon on any post to save it for later.</p>
        </div>
      ) : (
        <div className={styles.blogGrid}>
          {blogs.map((b) => (
            <Link key={b._id} href={`/blog/${b.slug}`} className={styles.blogCard}>
              {b.coverImageUrl ? (
                <img src={b.coverImageUrl} alt={b.title} className={styles.blogCover} />
              ) : (
                <div className={styles.blogCover} />
              )}
              <div className={styles.blogBody}>
                <h3 className={styles.blogTitle}>{b.title}</h3>
                <div className={styles.blogMeta}>
                  <span>by {b.authorName || b.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
