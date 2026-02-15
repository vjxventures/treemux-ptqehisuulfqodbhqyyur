import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian — AI Infrastructure Advisor",
  description:
    "AI-powered infrastructure intelligence for emerging economies. Research regions, analyze gaps, and generate actionable development plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
