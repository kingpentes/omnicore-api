import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniCore Reclamation Dashboard",
  description: "Post-mining reclamation monitoring dashboard for Kideco."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
