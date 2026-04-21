import type { Metadata } from 'next';
import { Cormorant_Garamond, Lora, Cinzel } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { JsonLd } from '@/components/JsonLd';
import { generateWebsiteSchema } from '@/lib/seo/schema';
import { ROUTES, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

const fontHeading = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const fontBody = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const fontCardTitle = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-card-title',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontBody.variable} ${fontCardTitle.variable}`}>
      <body className="antialiased font-body">
        <div className="shell">
          <header className="siteHeader">
            <Link href="/" className="brand">
              <span className="brandMark" aria-hidden="true">
                ✦
              </span>
              <div className="brandCopy">
                <strong>{SITE_NAME}</strong>
                <span>An image-first archive for the full 78-card deck</span>
              </div>
            </Link>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/cards">Cards</Link>
              <Link href="/cards/groups/major-arcana">Major Arcana</Link>
              <Link href="/reading">Reading</Link>
              <Link href="/rankings">Indexes</Link>
              <Link href={ROUTES.methodology}>Methodology</Link>
            </nav>
          </header>
          {children}
          <footer className="siteFooter">
            <span>
              {SITE_NAME} is a tarot reference library for upright meanings, reversed meanings,
              symbolism, and practical reading contexts.
            </span>
            <div className="nav">
              <Link href={ROUTES.about}>About</Link>
              <Link href={ROUTES.privacy}>Privacy</Link>
            </div>
          </footer>
        </div>
        <JsonLd data={generateWebsiteSchema()} />
      </body>
    </html>
  );
}
