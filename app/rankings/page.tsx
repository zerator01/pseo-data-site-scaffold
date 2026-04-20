import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tarot Card Rankings & Indexes | Daily Tarot',
  description: 'Explore our curated tarot indexes and rankings, including the most positive cards, the major arcana index, and warnings cards.',
};

const rankingGroups = [
  { slug: 'most-positive', title: 'The "Yes" Cards', desc: 'Cards that overwhelmingly indicate a positive or confirming answer in a reading.' },
  { slug: 'warning-cards', title: 'The Warning Cards', desc: 'Cards that demand immediate attention, caution, or indicate a firm "No".' },
  { slug: 'major-arcana-index', title: 'The Core Archetypes', desc: 'A complete index of the 22 Major Arcana cards that form the soul of the deck.' },
];

export default function RankingsHubPage() {
  return (
    <main className="shell">
      <header className="hero heroSparse">
        <h1 className="heroTitle">Rankings & Indexes</h1>
        <p className="heroSubtitle">Curated lists to help you quickly memorize and navigate the Gilded Shadow deck based on recurring patterns and outcomes.</p>
      </header>
      
      <section className="panel panelDense">
        <div className="bentoGrid">
          {rankingGroups.map(group => (
            <Link key={group.slug} href={`/rankings/${group.slug}`} className="bentoCard">
              <div className="bentoCardContent">
                <span className="eyebrow" style={{ color: 'var(--accent)' }}>Ranking List</span>
                <strong style={{ fontSize: '1.25rem', display: 'block', marginTop: '8px' }}>{group.title}</strong>
                <p style={{ marginTop: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{group.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
