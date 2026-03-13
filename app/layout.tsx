import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanju Tour Guide",
  description: "Customer Management for Tour Guides",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
