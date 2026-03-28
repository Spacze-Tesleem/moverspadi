import "@/src/globals.css";
import { siteMetadata } from "@/src/config/metadata";
import { geistSans, geistMono } from "@/src/config/fonts";

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
