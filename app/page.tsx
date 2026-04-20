import Image from 'next/image';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';
import { TAROT_GROUPS } from '@/lib/tarot-groups';
import DailyDraw from '@/components/DailyDraw';

const featuredSlugs = ['the-fool', 'the-high-priestess', 'death'];

export default function HomePage() {
  const featuredCards = featuredSlugs
    .map((slug) => cards.find((card) => card.slug === slug))
    .filter((card): card is (typeof cards)[number] => Boolean(card));

  const suitCards = TAROT_GROUPS.map((group) => ({
    ...group,
    count: cards.filter(group.matches).length,
  }));

  return (
    <main className="sectionStack">
      <section className="hero heroEditorial">
        <div className="heroCopy">
          <div className="eyebrow">Black-Gold Tarot Library</div>
          <h1>The definitive tarot reference, unified under one visual language.</h1>
          <p className="lede">
            Explore Major Arcana and the four suits through a rigid system: upright and
            reversed meanings, symbolism, relationship, and work interpretations.
          </p>
          <div className="editorialMetaRow" style={{ marginTop: '32px' }}>
            <span className="metaText accent">78 CARDS</span>
            <span className="metaDivider">/</span>
            <span className="metaText">MAJOR + MINOR ARCANA</span>
            <span className="metaDivider">/</span>
            <span className="metaText">UPRIGHT & REVERSED</span>
          </div>
          <div className="editorialButtonRow">
            <Link href="/cards" className="editorialLink">
              Explore The Deck <span>&#8594;</span>
            </Link>
            <Link href="/reading" className="editorialLink">
              Consult The Cards <span>&#8594;</span>
            </Link>
          </div>
        </div>

        <div className="heroVisual">
          <div className="cardStack">
            {featuredCards.map((card, index) => (
              <Link
                key={card.slug}
                href={`/cards/${card.slug}`}
                className={`showcaseCard showcaseCard${index + 1}`}
              >
                <div 
                  className="showcaseImageWrap" 
                  style={{ "--title-bottom": (card as any).titleOffsetBottom } as React.CSSProperties}
                >
                  <Image src={card.image} alt={card.name} fill className="showcaseImage" />
                  <div className="showcaseNameplate">
                    <span className="showcaseTitle">{card.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionIntro">
          <div className="eyebrow">The Grimoire</div>
          <h2>Registry of the Major & Minor Arcana.</h2>
        </div>
        
        <div className="exhibitionList">
          <Link href="/cards" className="exhibitionRow">
            <div>
              <strong className="exhibitionTitle">Full Deck Index</strong>
              <span className="exhibitionDesc">The complete gallery of all 78 arcana cards, structured for rapid visual reference.</span>
            </div>
            <div className="exhibitionData">
              <span className="exhibitionMeta">78 ITEMS</span>
              <span className="exhibitionMeta" style={{ color: 'var(--muted)' }}>ALL CARDS</span>
            </div>
          </Link>
          
          <Link href="/cards/groups/major-arcana" className="exhibitionRow">
            <div>
              <strong className="exhibitionTitle">Major Arcana</strong>
              <span className="exhibitionDesc">The 22 archetypal thresholds that shape profound life turns and spiritual foundations.</span>
            </div>
            <div className="exhibitionData">
              <span className="exhibitionMeta">22 ITEMS</span>
              <span className="exhibitionMeta" style={{ color: 'var(--muted)' }}>ARCHETYPES</span>
            </div>
          </Link>

          {suitCards.map((group) => (
            <Link key={group.slug} href={`/cards/groups/${group.slug}`} className="exhibitionRow">
              <div>
                <strong className="exhibitionTitle">{group.title}</strong>
                <span className="exhibitionDesc">Explore the cyclical journey of the {group.title}.</span>
              </div>
              <div className="exhibitionData">
                <span className="exhibitionMeta">{group.count} ITEMS</span>
                <span className="exhibitionMeta" style={{ color: 'var(--muted)' }}>MINOR ARCANA</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DailyDraw />

      <section className="panel panelDense" style={{ paddingBottom: '80px' }}>
        <div className="sectionIntro">
          <div className="eyebrow">Reading Method</div>
          <h2>A strict framework for consistent readings.</h2>
        </div>
        
        <div className="manifestoList">
          <div className="manifestoItem">
            <span className="manifestoNum">01</span>
            <div className="manifestoCopy">
              <strong>One Graphic Language</strong>
              <span>Every page follows identical spatial rules, ensuring comparisons across the 78 cards remain clinical and untainted by shifting art styles.</span>
            </div>
          </div>
          <div className="manifestoItem">
            <span className="manifestoNum">02</span>
            <div className="manifestoCopy">
              <strong>Direct Reading Structure</strong>
              <span>Each card moves from primary archetype to application without detouring into unnecessary spiritual fluff or modern colloquialisms.</span>
            </div>
          </div>
          <div className="manifestoItem">
            <span className="manifestoNum">03</span>
            <div className="manifestoCopy">
              <strong>Museum-Grade Precision</strong>
              <span>The typography, geometry, and border language belong to an ancient black-and-gold system, treating the deck as a historical exhibit.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
