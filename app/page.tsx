import Image from 'next/image';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';
import { TAROT_GROUPS } from '@/lib/tarot-groups';
import DailyDraw from '@/components/DailyDraw';

export default function HomePage() {
  const masonryCards = cards.slice(0, 16);
  const col1 = masonryCards.slice(0, 4);
  const col2 = masonryCards.slice(4, 8);
  const col3 = masonryCards.slice(8, 12);
  const col4 = masonryCards.slice(12, 16);

  const portals = [
    {
      href: '/cards',
      title: 'Full Deck Index',
      meta: '78 cards',
      image: cards.find((c) => c.slug === 'the-magician')?.image || '',
    },
    {
      href: '/cards/groups/major-arcana',
      title: 'Major Arcana',
      meta: '22 cards',
      image: cards.find((c) => c.slug === 'the-fool')?.image || '',
    },
    ...TAROT_GROUPS.map((group) => {
      const match = cards.filter(group.matches);
      return {
        href: `/cards/groups/${group.slug}`,
        title: group.title,
        meta: `${match.length} cards`,
        image: match[0]?.image || '',
      };
    }),
  ];

  return (
    <main className="sectionStack">
      <section className="heroCinematic">
        <div className="heroMasonry">
          {[col1, col2, col3, col4].map((col, i) => (
            <div key={i} className="masonryColumn">
              {col.map((card) => (
                <div key={card.slug} className="masonryCard">
                  <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="heroCinematicCopy">
          <div className="eyebrow">Tarot Image Archive</div>
          <h1>See the cards before you interpret them.</h1>
          <p className="lede">
            DailyTarot is built like a visual library, not a blog. Browse all 78 cards, compare
            archetypes, and move from artwork to meaning through a calmer, more premium reading
            experience.
          </p>
          <div className="editorialMetaRow">
            <span className="metaText accent">78 cards</span>
            <span className="metaDivider">/</span>
            <span className="metaText">upright and reversed meanings</span>
            <span className="metaDivider">/</span>
            <span className="metaText">image-led navigation</span>
          </div>
          <div className="editorialButtonRow">
            <Link href="/cards" className="editorialLink">
              Browse The Deck <span>&#8594;</span>
            </Link>
            <Link href="/reading" className="buttonGhost">
              Start A Reading
            </Link>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionIntro center">
          <div className="eyebrow">Explore By Collection</div>
          <h2>Move through the deck like a curated gallery.</h2>
          <p className="lede">
            Jump into the full deck, start with the Major Arcana, or enter by suit when you want a
            narrower symbolic mood.
          </p>
        </div>

        <div className="visualGrimoire">
          {portals.map((portal) => (
            <Link key={portal.title} href={portal.href} className="portalCard">
              <Image src={portal.image} alt={portal.title} fill className="portalImage" />
              <div className="portalOverlay" />
              <div className="portalContent">
                <span className="portalTitle">{portal.title}</span>
                <span className="portalMeta">{portal.meta}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DailyDraw />

      <section className="panel">
        <div className="sectionIntro">
          <div className="eyebrow">Why It Feels Better</div>
          <h2>Built to make the images carry more of the experience.</h2>
          <p className="lede">
            The layout stays restrained so the cards feel valuable. Text acts as a guide rail, not
            wallpaper.
          </p>
        </div>

        <div className="manifestoSplit">
          <div className="manifestoVisualSticky">
            <Image
              src={cards.find((c) => c.slug === 'the-high-priestess')?.image || ''}
              alt="The High Priestess"
              fill
              className="manifestoImage"
            />
          </div>
          <div className="manifestoList">
            <div className="manifestoItem">
              <span className="manifestoNum">01</span>
              <div className="manifestoCopy">
                <strong>Image-first hierarchy</strong>
                <span>
                  Card art, crop, scale, and mood establish the emotional read before the
                  explanatory text takes over.
                </span>
              </div>
            </div>
            <div className="manifestoItem">
              <span className="manifestoNum">02</span>
              <div className="manifestoCopy">
                <strong>One system across every page</strong>
                <span>
                  Home, library, single-card detail, combinations, and reading flows now feel like
                  one place instead of separate experiments.
                </span>
              </div>
            </div>
            <div className="manifestoItem">
              <span className="manifestoNum">03</span>
              <div className="manifestoCopy">
                <strong>Archive-grade reading UX</strong>
                <span>
                  The interface frames each card like a collectible plate, which helps the deck
                  feel deliberate, premium, and worth lingering on.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
