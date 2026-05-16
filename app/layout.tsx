import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataPath Academy - Assignments & Solutions for Data Professionals",
  description:
    "Practice SQL, Python, Data Engineering, Cloud Computing, and Case Studies with real assignments and fully explained solutions. One-time payment, instant PDF download.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
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
              iconTheme: { primary: "#0f766e", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
