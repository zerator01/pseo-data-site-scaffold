import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';
import { parsePairSlug, generateCombinationNarrative, generateCombinationKeywords, getAllPairSlugs } from '@/lib/combinations';
import TarotCard from '@/components/TarotCard';
import { resolveCardImageUrl } from '@/lib/card-images';
import styles from './Combinations.module.css';

export async function generateStaticParams() {
  // ONLY pre-render a few major combinations for the static Cloudflare preview
  // Dokploy (SSR) will handle the rest dynamically
  const topCards = ['the-fool', 'the-magician', 'the-high-priestess', 'the-empress', 'death'];
  const params: { pair: string }[] = [];
  
  for (let i = 0; i < topCards.length; i++) {
    for (let j = i + 1; j < topCards.length; j++) {
      params.push({ pair: `${topCards[i]}-and-${topCards[j]}` });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const pair = parsePairSlug(resolvedParams.pair);
  if (!pair) return { title: 'Not Found' };
  
  const card1 = cards.find(c => c.slug === pair[0]);
  const card2 = cards.find(c => c.slug === pair[1]);
  
  if (!card1 || !card2) return { title: 'Not Found' };

  return {
    title: `${card1.name} and ${card2.name} Tarot Combination Meaning`,
    description: `Discover the combined tarot meaning of ${card1.name} and ${card2.name}. Learn how these two cards interact in readings for love, career, and life.`,
  };
}

export default async function CombinationPage({ params }: { params: Promise<{ pair: string }> }) {
  const resolvedParams = await params;
  const pair = parsePairSlug(resolvedParams.pair);
  
  if (!pair) notFound();

  const card1 = cards.find(c => c.slug === pair[0]);
  const card2 = cards.find(c => c.slug === pair[1]);

  if (!card1 || !card2) notFound();

  const narrative = generateCombinationNarrative(card1, card2);
  const keywords = generateCombinationKeywords(card1, card2);

  return (
    <main className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}>Tarot Combinations</div>
        <h1 className={styles.title}>{card1.name} & {card2.name}</h1>
        <div className={styles.tags}>
          {keywords.map(kw => (
            <span key={kw} className={styles.tag}>{kw}</span>
          ))}
        </div>
      </header>

      <section className={styles.visuals}>
        <div className={styles.cardWrapper}>
          <TarotCard cardName={card1.name} imagePath={resolveCardImageUrl(card1.image)} titleOffsetBottom={(card1 as any).titleOffsetBottom} />
        </div>
        <div className={styles.plusSign}>+</div>
        <div className={styles.cardWrapper}>
          <TarotCard cardName={card2.name} imagePath={resolveCardImageUrl(card2.image)} titleOffsetBottom={(card2 as any).titleOffsetBottom} />
        </div>
      </section>

      <section className={styles.narrative}>
        {narrative.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className={styles.paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className={styles.actions}>
        <Link href={`/cards/${card1.slug}`} className="buttonGhost">Read {card1.name}</Link>
        <Link href={`/cards/${card2.slug}`} className="buttonGhost">Read {card2.name}</Link>
      </section>
    </main>
  );
}
