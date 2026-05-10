import { redirect } from "next/navigation";
import { getSessionUser, isOwnerOrAdmin } from "@/app/lib/auth";
import fetchBlog from "@/app/actions/fetchBlog";
import BlogEditor from "@/app/components/dashboard/BlogEditor";
import NotFoundPage from "@/app/components/common/NotFoundPage";

export const dynamic = "force-dynamic";

const Page = async ({ params }) => {
  const { slug } = await params;
  const session = await getSessionUser();
  if (!session) redirect(`/sign-in?redirect_url=/dashboard/blogs/${slug}/edit`);

  const result = await fetchBlog(slug);
  if (!result.success) return <NotFoundPage />;

  if (!isOwnerOrAdmin(session, result.data)) return <NotFoundPage />;

  return (
    <BlogEditor
      mode="edit"
      blog={result.data}
      session={JSON.parse(JSON.stringify(session))}
    />
  );
};

export default Page;
