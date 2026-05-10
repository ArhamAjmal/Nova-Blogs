import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/auth";
import SettingsForm from "@/app/components/dashboard/SettingsForm";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getSessionUser();
  if (!session) redirect("/sign-in?redirect_url=/dashboard/settings");
  return <SettingsForm profile={JSON.parse(JSON.stringify(session.profile))} />;
};

export default Page;
