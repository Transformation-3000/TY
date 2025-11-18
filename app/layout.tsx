import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Longevity Dashboard",
  description: "Longevity Dashboard - Gesundheitsüberwachung",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
