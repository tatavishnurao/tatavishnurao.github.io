import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.shortTitle}`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: `${site.name} | ${site.shortTitle}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
