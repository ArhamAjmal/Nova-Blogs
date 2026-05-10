import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ProgressBar from "./components/common/ProgressBar";
import "./globals.css";

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
  description: "Fresh perspectives and thought-provoking insights for curious minds.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ProgressBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
