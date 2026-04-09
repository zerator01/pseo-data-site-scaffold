import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { JsonLd } from '@/components/JsonLd';
import { generateWebsiteSchema } from '@/lib/seo/schema';
import { PROJECT_CONFIG, ROUTES, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

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
    <html lang="en">
      <body>
        <div className="shell">
          <header className="siteHeader">
            <Link href="/" className="brand">
              <strong>{SITE_NAME}</strong>
              <span>{PROJECT_CONFIG.siteTagline}</span>
            </Link>
            <nav className="nav">
              <Link href={ROUTES.entityDirectory}>{PROJECT_CONFIG.entityPlural}</Link>
              <Link href={ROUTES.defaultCategoryHub}>{PROJECT_CONFIG.defaultCategoryHubLabel}</Link>
              <Link href={ROUTES.rankings}>Rankings</Link>
              <Link href={ROUTES.methodology}>Methodology</Link>
            </nav>
          </header>
          {children}
          <footer className="siteFooter">
            <span>Independent publisher starter. Replace with your real project identity.</span>
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
