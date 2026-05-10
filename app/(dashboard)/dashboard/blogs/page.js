import { getMyBlogs } from "@/app/actions/dashboard";
import BlogList from "@/app/components/dashboard/BlogList";

export const dynamic = "force-dynamic";

const Page = async () => {
  const [{ data: published = [] }, { data: drafts = [] }] = await Promise.all([
    getMyBlogs({ status: "published" }),
    getMyBlogs({ status: "draft" }),
  ]);
  return <BlogList initialPublished={published} initialDrafts={drafts} />;
};

export default Page;
