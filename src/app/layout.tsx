import type { Metadata } from "next";
import { Italiana, Lora } from "next/font/google";
import "./globals.css";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Daily Tarot | Interactive Free Readings",
  description: "Experience premium interactive free tarot readings with the Gilded Shadow deck.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${italiana.variable} ${lora.variable} antialiased base-theme`}>
        {children}
      </body>
    </html>
  );
}
