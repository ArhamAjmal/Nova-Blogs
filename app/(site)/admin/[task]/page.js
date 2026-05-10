import { redirect } from "next/navigation";

const Page = async ({ params, searchParams }) => {
  const { task } = await params;
  const sp = await searchParams;

  if (task === "create") redirect("/dashboard/blogs/new");
  if (task === "edit" && sp?.slug) redirect(`/dashboard/blogs/${sp.slug}/edit`);
  redirect("/dashboard/blogs");
};

export default Page;
