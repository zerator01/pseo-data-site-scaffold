import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';

const ALL_RANKING_SLUGS = ['most-positive', 'warning-cards', 'major-arcana-index'];

export async function generateStaticParams() {
  return ALL_RANKING_SLUGS.map(slug => ({ slug }));
}

function getRankingData(slug: string) {
  switch (slug) {
    case 'most-positive':
      return {
        title: 'The Most Positive "Yes" Cards',
        desc: 'These cards overwhelmingly indicate a positive answer, blessing, or confirmation in a reading.',
        cards: cards.filter(c => c.yesno.toLowerCase().includes('yes')),
      };
    case 'warning-cards':
      return {
        title: 'The Warning "No" Cards',
        desc: 'These cards demand immediate attention, caution, or indicate a firm "No" to the question asked.',
        cards: cards.filter(c => c.yesno.toLowerCase().includes('no')),
      };
    case 'major-arcana-index':
      return {
        title: 'Major Arcana Complete Index',
        desc: 'The 22 core archetypes that define the central journey of the tarot deck.',
        cards: cards.filter(c => c.arcana === 'major').sort((a,b) => a.number - b.number),
      };
    default:
      return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = getRankingData(resolvedParams.slug);
  if (!data) return { title: 'Not Found' };
  
  return {
    title: `${data.title} | Daily Tarot Rankings`,
    description: data.desc,
  };
}

export default async function RankingGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = getRankingData(resolvedParams.slug);

  if (!data) notFound();

  return (
    <main className="shell">
      <div className="crumbs" style={{ marginBottom: '24px' }}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/rankings">Rankings</Link>
        <span>/</span>
        <span>{data.title}</span>
      </div>

      <header className="hero heroSparse">
        <h1 className="heroTitle">{data.title}</h1>
        <p className="heroSubtitle">{data.desc}</p>
      </header>

      <section className="panel panelDense">
        <div className="bentoGrid">
          {data.cards.map((card) => (
            <Link key={card.slug} href={`/cards/${card.slug}`} className="bentoCard">
              <div className="bentoCardContent">
                <span className="eyebrow">{card.arcana} arcana</span>
                <strong style={{ fontSize: '1.25rem', display: 'block', marginTop: '8px' }}>{card.name}</strong>
                <p style={{ marginTop: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{card.meaning.upright.general.slice(0, 100)}...</p>
                <div style={{ marginTop: '16px', display: 'inline-block', padding: '4px 10px', background: 'rgba(211, 168, 76, 0.1)', color: 'var(--accent)', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {card.yesno}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
