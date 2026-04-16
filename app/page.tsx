import Image from 'next/image';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';
import { TAROT_GROUPS } from '@/lib/tarot-groups';

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
      <section className="hero heroLarge">
        <div className="heroCopy">
          <div className="eyebrow">Black-Gold Tarot Library</div>
          <h1>A full-deck tarot reference with one visual language and 78 real card pages.</h1>
          <p className="lede">
            Explore Major Arcana and the four suits through a consistent deck system: upright and
            reversed meanings, symbolism, relationship readings, work readings, money readings,
            health interpretations, and a direct yes-or-no lens.
          </p>
          <div className="badgeRow">
            <span className="badge">78 cards</span>
            <span className="badge subtle">Major + Minor Arcana</span>
            <span className="badge subtle">Upright and reversed interpretations</span>
          </div>
          <div className="buttonRow">
            <Link href="/cards" className="button">
              Browse the deck
            </Link>
            <Link href="/cards/the-fool" className="buttonGhost">
              Read The Fool
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
          <h2>Explore the Gilded Shadow deck.</h2>
          <p className="lede">
            Whether you are drawing a daily spread or studying the archetypes, enter the library through the path that serves your current reading.
          </p>
        </div>
        
        <div className="bentoGrid">
          {/* Main Hero Bento */}
          <Link href="/cards" className="bentoCard bentoHero">
            <strong>Full Deck Index</strong>
            <span>See every card in one sweep and jump straight to the page you need. The ultimate visual reference across all 78 arcana.</span>
          </Link>

          {/* Secondary Action */}
          <Link href="/reading" className="bentoCard bentoAction">
            <strong>Interactive Reading</strong>
            <span>Open the visual reading flow instead of entering through the index. Let the cards fall where they may.</span>
          </Link>
          
          <Link href="/cards/groups/major-arcana" className="bentoCard bentoAction">
            <strong>Major Arcana</strong>
            <span>Read the 22 archetypal thresholds that shape big life turns.</span>
          </Link>

          {/* Suits Sub-Grid placed inside Bento */}
          <div className="bentoSuitsGrid">
            {suitCards.map((group) => (
              <Link key={group.slug} href={`/cards/groups/${group.slug}`} className="bentoSuitTile">
                <strong>{group.title}</strong>
                <span>{group.count} cards</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="panel panelDense">
        <div className="sectionIntro">
          <div className="eyebrow">Reading Method</div>
          <h2>Built to help cards compare cleanly across the full deck.</h2>
        </div>
        <div className="grid valueGrid">
          <div className="card cardLuxe">
            <strong>One Deck Language</strong>
            <span>Every page follows the same reading frame, so comparing cards stays easy.</span>
          </div>
          <div className="card cardLuxe">
            <strong>Direct Reading Structure</strong>
            <span>Each card moves from archetype to application without detouring into fluff.</span>
          </div>
          <div className="card cardLuxe">
            <strong>Visual Deck Consistency</strong>
            <span>The card art, card back, and library structure all belong to one black-and-gold system.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
