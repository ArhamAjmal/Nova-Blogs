import Link from "next/link";
import dbConnect from "@/app/lib/connect";
import BlogModel from "@/app/lib/model";
import styles from "@/app/components/site/site.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Explore Categories – Nova Blogs",
  description: "Browse blog categories: technology, innovation, AI, healthcare, and more.",
};

const Page = async () => {
  await dbConnect();

  const counts = await BlogModel.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$category", count: { $sum: 1 }, latestCover: { $first: "$coverImageUrl" } } },
    { $match: { _id: { $ne: "" } } },
    { $sort: { count: -1 } },
  ]);

  const totalPublished = counts.reduce((s, c) => s + c.count, 0);

  return (
    <main className={styles.pageWrap}>
      <h1 className={styles.heading}>Explore Categories</h1>
      <p className={styles.subheading}>
        {totalPublished} articles across {counts.length} categories. Pick a topic and dive in.
      </p>

      <div className={styles.cardGrid}>
        {counts.map((c) => (
          <Link
            key={c._id || "uncategorized"}
            href={`/categories/${encodeURIComponent(c._id || "")}`}
            className={styles.articleCard}
            style={{ textDecoration: "none" }}
          >
            {c.latestCover ? (
              <img src={c.latestCover} alt={c._id} className={styles.articleCardCover} />
            ) : (
              <div className={styles.articleCardCover} />
            )}
            <div className={styles.articleCardBody}>
              <h3 style={{ textTransform: "capitalize", fontSize: "1.15rem" }}>{c._id || "Uncategorized"}</h3>
              <p style={{ marginBottom: 0 }}>
                {c.count} article{c.count === 1 ? "" : "s"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Page;
