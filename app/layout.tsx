import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrueYears – Longevity Dashboard",
  description: "Dein täglicher Companion für Verhalten, Motivation und Longevity.",
  robots: "noindex",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrueYears",
  },
};

export const viewport: Viewport = {
  themeColor: "#4498ca",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var pathname = window.location.pathname;
            if (pathname !== '/login' && !pathname.startsWith('/api/auth')) {
              var lastActive = localStorage.getItem('ty_last_active');
              var now = Date.now();
              var isSessionExpired = !lastActive || (now - Number(lastActive) > 10 * 60 * 1000); // 10 Minuten
              var isSessionActive = sessionStorage.getItem('ty_session_active') === 'true';

              if (isSessionExpired || !isSessionActive) {
                document.cookie = "longevity_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = "member_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                localStorage.removeItem('ty_last_active');
                sessionStorage.removeItem('ty_session_active');
                window.location.href = '/login?from=' + encodeURIComponent(pathname);
              } else {
                localStorage.setItem('ty_last_active', now.toString());
              }
            }
          })();
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
