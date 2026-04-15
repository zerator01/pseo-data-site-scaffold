import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { SITE_URL } from '@/lib/site';
import { getTarotGroup, getTarotGroupCards, TAROT_GROUPS } from '@/lib/tarot-groups';
import styles from './page.module.css';

export async function generateStaticParams() {
  return TAROT_GROUPS.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const group = getTarotGroup(resolvedParams.slug);

  if (!group) {
    return { title: 'Tarot Group Not Found' };
  }

  return {
    title: `${group.title} Tarot Meaning Guide`,
    description: `${group.description} Browse all ${group.title} tarot cards with upright and reversed meanings, symbolism, and practical interpretations.`,
    alternates: {
      canonical: `${SITE_URL}/cards/groups/${group.slug}`,
    },
  };
}

export default async function TarotGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const group = getTarotGroup(resolvedParams.slug);

  if (!group) {
    notFound();
  }

  const groupCards = getTarotGroupCards(group.slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tarot Cards', url: '/cards' },
    { name: group.title, url: `/cards/groups/${group.slug}` },
  ]);

  return (
    <main className={styles.page}>
      <JsonLd data={breadcrumbSchema} />

      <section className={styles.hero}>
        <div className={styles.crumbs}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/cards">Cards</Link>
          <span>/</span>
          <span>{group.title}</span>
        </div>
        <div className={styles.eyebrow}>Tarot Group Guide</div>
        <h1>{group.title} Tarot Card Meanings</h1>
        <p className={styles.lede}>{group.description}</p>
        <div className={styles.metricRow}>
          <div className={styles.metricCard}>
            <span>Cards In Group</span>
            <strong>{groupCards.length}</strong>
          </div>
          <div className={styles.metricCard}>
            <span>Reading Depth</span>
            <strong>Upright + Reversed</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Explore The Group</span>
          <h2>{group.title} Card Library</h2>
        </div>
        <div className={styles.cardGrid}>
          {groupCards.map((card) => (
            <Link key={card.slug} href={`/cards/${card.slug}`} className={styles.cardTile}>
              <div className={styles.cardMeta}>
                {card.arcana === 'major' ? `#${card.number}` : card.name.split(' ')[0]}
              </div>
              <h3>{card.name}</h3>
              <p>{card.meaning.upright.general}</p>
              <div className={styles.tagRow}>
                {card.keywords.upright.slice(0, 2).map((keyword) => (
                  <span key={keyword} className={styles.tag}>
                    {keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>More Paths</span>
          <h2>Browse Other Tarot Groups</h2>
        </div>
        <div className={styles.groupGrid}>
          {TAROT_GROUPS.filter((entry) => entry.slug !== group.slug).map((entry) => (
            <Link key={entry.slug} href={`/cards/groups/${entry.slug}`} className={styles.groupCard}>
              <strong>{entry.title}</strong>
              <span>{entry.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
