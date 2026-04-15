import type { Metadata } from 'next';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';
import { TAROT_GROUPS } from '@/lib/tarot-groups';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'All Tarot Cards',
  description:
    'Browse all 78 tarot cards with upright and reversed meanings for love, career, money, health, symbolism, and yes-or-no guidance.',
  alternates: {
    canonical: 'https://dailytarot.org/cards',
  },
};

const majorArcana = cards.filter((card) => card.arcana === 'major');
const minorArcanaGroups = ['Wands', 'Cups', 'Swords', 'Pentacles'].map((suit) => ({
  suit,
  cards: cards.filter((card) => card.arcana === 'minor' && card.suit === suit),
}));

export default function CardsIndexPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>Tarot Deck Index</div>
        <h1>Browse All 78 Tarot Cards</h1>
        <p className={styles.lede}>
          Explore the full deck by arcana and suit. Every card page includes upright and
          reversed readings, symbolism, practical life-area interpretations, and a direct
          yes-or-no lens.
        </p>
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <span>Major Arcana</span>
            <strong>{majorArcana.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Minor Arcana</span>
            <strong>{cards.length - majorArcana.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Reading Pages</span>
            <strong>{cards.length}</strong>
          </div>
        </div>
        <div className={styles.groupJumpRow}>
          {TAROT_GROUPS.map((group) => (
            <Link key={group.slug} href={`/cards/groups/${group.slug}`} className={styles.groupJump}>
              {group.title}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Major Arcana</span>
          <h2>The Big Turning Points</h2>
        </div>
        <div className={styles.cardGrid}>
          {majorArcana.map((card) => (
            <Link key={card.slug} href={`/cards/${card.slug}`} className={styles.cardTile}>
              <div className={styles.cardMeta}>#{card.number}</div>
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

      {minorArcanaGroups.map((group) => (
        <section key={group.suit} className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>{group.suit}</span>
            <h2>{group.suit} Suit Meanings</h2>
          </div>
          <div className={styles.cardGrid}>
            {group.cards.map((card) => (
              <Link key={card.slug} href={`/cards/${card.slug}`} className={styles.cardTile}>
                <div className={styles.cardMeta}>{card.name.split(' ')[0]}</div>
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
      ))}
    </main>
  );
}
