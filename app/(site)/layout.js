import { Geist, Geist_Mono } from "next/font/google";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nova Blogs",
  description: "Fresh perspectives and thought-provoking insights.",
};

export default function PublicLayout({ children }) {
  return (
    <div className="site-theme">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
