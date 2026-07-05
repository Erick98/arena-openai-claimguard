import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaimGuard",
  description: "Denial prevention and appeal operations for independent medical practices.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
