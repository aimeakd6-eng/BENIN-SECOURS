import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BENIN SECOURS - Admin Dashboard",
  description: "Dashboard administrateur BENIN SECOURS",
};

import { SidebarProvider } from "@/lib/SidebarContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
