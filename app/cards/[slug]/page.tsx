import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import data from '@/../data/tarot-cards.json';
import styles from './CardPage.module.css';
import TarotCard from '@/components/TarotCard';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schema';
import { resolveCardImageUrl } from '@/lib/card-images';
import { canonicalPairSlug } from '@/lib/combinations';

const areaSections = [
  { key: 'love', label: 'Love & Relationships', icon: 'Heart' },
  { key: 'career', label: 'Career & Work', icon: 'Work' },
  { key: 'finance', label: 'Money & Resources', icon: 'Money' },
  { key: 'health', label: 'Health & Energy', icon: 'Health' },
] as const;

// 1. Generate Static Params for all 78 cards
export async function generateStaticParams() {
  return data.map((card) => ({
    slug: card.slug,
  }));
}

// 2. Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const card = data.find((c) => c.slug === resolvedParams.slug);
  
  if (!card) {
    return { title: 'Card Not Found' };
  }

  return {
    title: `${card.name} Tarot Card Meaning`,
    description: `Discover ${card.name} tarot card meanings with upright and reversed interpretations for love, career, money, health, symbolism, and yes-or-no guidance.`,
    alternates: {
      canonical: `https://dailytarot.org/cards/${card.slug}`,
    }
  };
}

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const card = data.find((c) => c.slug === resolvedParams.slug);

  if (!card) {
    notFound();
  }

  const cardIndex = data.findIndex((entry) => entry.slug === card.slug);
  const previousCard = cardIndex > 0 ? data[cardIndex - 1] : null;
  const nextCard = cardIndex < data.length - 1 ? data[cardIndex + 1] : null;
  const relatedCards = data
    .filter((entry) => entry.slug !== card.slug && (
      card.arcana === 'major'
        ? entry.arcana === 'major'
        : entry.suit === card.suit
    ))
    .slice(0, 3);

  const arcanaLabel = card.arcana === 'major'
    ? `Major Arcana • ${card.number}`
    : `${card.suit} • ${card.number <= 10 ? `Number ${card.number}` : card.name.split(' ')[0]}`;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tarot Cards', url: '/cards' },
    { name: card.name, url: `/cards/${card.slug}` },
  ]);

  const faqSchema = generateFAQSchema([
    {
      question: `What does ${card.name} mean upright?`,
      answer: card.meaning.upright.general,
    },
    {
      question: `What does ${card.name} mean reversed?`,
      answer: card.meaning.reversed.general,
    },
    {
      question: `What does ${card.name} mean in love?`,
      answer: `${card.meaning.upright.love} ${card.meaning.reversed.love}`,
    },
  ]);

  const imagePath = resolveCardImageUrl(card.image);

  return (
    <main className={styles.container}>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.crumbs}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/cards">Cards</Link>
            <span>/</span>
            <span>{card.name}</span>
          </div>
          <div className={styles.eyebrow}>{arcanaLabel}</div>
          <h1 className={styles.title}>{card.name}</h1>
          <p className={styles.subtitle}>
            A structured reading of {card.name}, with upright and reversed meanings for relationships, work, money, health, and core symbolism.
          </p>
          <div className={styles.heroMeta}>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Yes / No</span>
              <span className={styles.metaValue}>{card.yesno}</span>
            </div>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Upright Themes</span>
              <div className={styles.metaTags}>
                {card.keywords.upright.slice(0, 3).map((kw) => (
                  <span key={kw} className={styles.metaTag}>{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Render the actual 3D Interactive Card */}
        <div className={styles.cardShowcase}>
          <TarotCard 
            cardName={card.name} 
            imagePath={imagePath} 
            isFlipped={false} 
            titleOffsetBottom={(card as any).titleOffsetBottom}
          />
        </div>
      </header>

      <section className={styles.tankContent}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Quick Read</span>
            <h2>Card Snapshot</h2>
          </div>
          <div className={styles.snapshotGrid}>
            <div className={styles.snapshotCard}>
              <span className={styles.snapshotLabel}>Core Pattern</span>
              <p>{card.meaning.upright.general}</p>
            </div>
            <div className={styles.snapshotCard}>
              <span className={styles.snapshotLabel}>Symbolic Center</span>
              <p>{card.symbolism}</p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Orientation</span>
            <h2>Upright vs Reversed</h2>
          </div>
          <div className={styles.grid2}>
            <div className={styles.cardMeaning}>
              <div className={styles.meaningHeader}>
                <h3>Upright</h3>
                <div className={styles.tags}>
                  {card.keywords.upright.map((kw, i) => (
                    <span key={i} className={styles.tag}>{kw}</span>
                  ))}
                </div>
              </div>
              <p>{card.meaning.upright.general}</p>
            </div>
            <div className={styles.cardMeaningReversed}>
              <div className={styles.meaningHeader}>
                <h3>Reversed</h3>
                <div className={styles.tags}>
                  {card.keywords.reversed.map((kw, i) => (
                    <span key={i} className={styles.tagReversed}>{kw}</span>
                  ))}
                </div>
              </div>
              <p>{card.meaning.reversed.general}</p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Life Areas</span>
            <h2>Applied Interpretations</h2>
          </div>
          <div className={styles.areaStack}>
            {areaSections.map((section) => (
              <article key={section.key} className={styles.areaCard}>
                <div className={styles.areaTopline}>{section.icon}</div>
                <h3>{section.label}</h3>
                <div className={styles.areaColumns}>
                  <div className={styles.areaPane}>
                    <span className={styles.areaLabel}>Upright</span>
                    <p>{card.meaning.upright[section.key]}</p>
                  </div>
                  <div className={styles.areaPaneReversed}>
                    <span className={styles.areaLabel}>Reversed</span>
                    <p>{card.meaning.reversed[section.key]}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Reading Notes</span>
            <h2>How To Use This Card</h2>
          </div>
          <div className={styles.notesGrid}>
            <div className={styles.noteCard}>
              <span className={styles.noteLabel}>Symbolism</span>
              <p>{card.symbolism}</p>
            </div>
            <div className={styles.noteCard}>
              <span className={styles.noteLabel}>Straight Answer</span>
              <p>{card.yesno}</p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Combinations</span>
            <h2>Common Pairings</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedCards.map((relatedCard) => {
              const pairSlug = canonicalPairSlug(card.slug, relatedCard.slug);
                
              return (
                <Link key={pairSlug} href={`/combinations/${pairSlug}`} className={styles.relatedCard}>
                  <span className={styles.relatedLabel}>{card.name} + {relatedCard.name}</span>
                  <strong>Read Combination</strong>
                </Link>
              );
            })}
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>Keep Reading</span>
            <h2>Explore Related Cards</h2>
          </div>
          <div className={styles.relatedGrid}>
            {previousCard ? (
              <Link href={`/cards/${previousCard.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedLabel}>Previous Card</span>
                <strong>{previousCard.name}</strong>
              </Link>
            ) : null}
            {nextCard ? (
              <Link href={`/cards/${nextCard.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedLabel}>Next Card</span>
                <strong>{nextCard.name}</strong>
              </Link>
            ) : null}
            {relatedCards.map((relatedCard) => (
              <Link key={relatedCard.slug} href={`/cards/${relatedCard.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedLabel}>
                  {card.arcana === 'major' ? 'Major Arcana' : card.suit}
                </span>
                <strong>{relatedCard.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
