import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/auth";
import BlogEditor from "@/app/components/dashboard/BlogEditor";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getSessionUser();
  if (!session) redirect("/sign-in?redirect_url=/dashboard/blogs/new");
  return <BlogEditor mode="create" blog={null} session={JSON.parse(JSON.stringify(session))} />;
};

export default Page;
