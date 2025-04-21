import React from "react";
// Import other necessary components like ThemeRegistry, global styles, etc.
import ThemeRegistry from "../theme/ThemeRegistry"; // Uncommented import
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <AuthProvider>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap&subset=vietnamese"
            rel="stylesheet"
          />
        </head>
        <body>
          <ThemeRegistry>{children}</ThemeRegistry>
        </body>
      </AuthProvider>
    </html>
  );
}
