import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PwaProvider } from "@/components/PwaProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CodeMentor Academy — Learn to code, level by level",
  description:
    "Your personal AI coding teacher. Lessons, quizzes, exams, and a code playground for Python, JavaScript, C++, Java, SQL and more.",
  manifest: "/manifest.webmanifest",
  applicationName: "CodeMentor Academy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CodeMentor",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <PwaProvider />
      </body>
    </html>
  );
}
