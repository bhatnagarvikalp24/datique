import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Datique – We Turn Profiles Into Matches",
  description:
    "Datique uses advanced AI to analyse your Hinge, Bumble or Tinder profile and deliver a brutally honest, actionable PDF review — so you start getting matches, not excuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#f43f5e", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
