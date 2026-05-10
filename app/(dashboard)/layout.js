import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/auth";
import syncUser from "@/app/actions/syncUser";
import Sidebar from "@/app/components/dashboard/Sidebar";
import { ToastProvider } from "@/app/components/dashboard/Toaster";
import styles from "@/app/components/dashboard/dashboard.module.css";

export const metadata = {
  title: "Dashboard – Nova Blogs",
  description: "Manage your blogs, profile, and analytics.",
};

export default async function DashboardLayout({ children }) {
  let session = await getSessionUser();
  if (!session) {
    await syncUser();
    session = await getSessionUser();
  }
  if (!session) redirect("/sign-in?redirect_url=/dashboard");

  return (
    <ToastProvider>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </ToastProvider>
  );
}
