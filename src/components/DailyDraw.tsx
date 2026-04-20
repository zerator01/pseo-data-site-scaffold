"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import cards from '@/../data/tarot-cards.json';
import TarotCard from '@/components/TarotCard';
import { resolveCardImageUrl } from '@/lib/card-images';
import styles from './DailyDraw.module.css';

function getLocalDayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default function DailyDraw() {
  const [drawnCard, setDrawnCard] = useState<typeof cards[0] | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const today = getLocalDayKey();
    const storedRecord = localStorage.getItem('dailytarot_dailydraw');
    
    if (storedRecord) {
      try {
        const { date, slug } = JSON.parse(storedRecord);
        if (date === today) {
          const card = cards.find(c => c.slug === slug);
          if (card) {
            queueMicrotask(() => {
              setDrawnCard(card);
              setIsFlipped(true); // Already drawn today
            });
          }
        }
      } catch {
        // Safe fail
      }
    }
  }, []);

  const handleDraw = () => {
    if (drawnCard) return; // Already drawn

    // Random pick
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const today = getLocalDayKey();

    localStorage.setItem('dailytarot_dailydraw', JSON.stringify({
      date: today,
      slug: randomCard.slug
    }));

    setDrawnCard(randomCard);
    
    // Slight delay for dramatic tension
    setTimeout(() => {
      setIsFlipped(true);
    }, 100);
  };

  return (
    <section className={styles.container}>
      <div className={styles.copyCol}>
        <div className={styles.intro}>
          <h2>Your Daily Pull</h2>
          {!drawnCard ? (
            <p>Focus on your current state of mind. Click the card when you are ready to receive your daily anchor.</p>
          ) : (
            <p>The cards have spoken for today. Reflect on this archetype as you move through your waking hours.</p>
          )}
        </div>

        {drawnCard && isFlipped && (
          <div className={styles.resultBox}>
            <h3 className={styles.cardName}>{drawnCard.name}</h3>
            <p className={styles.drawText}>
              {drawnCard.meaning.upright.general.split('. ')[0] + '.'}
            </p>
            <div className="buttonRow">
              <Link href={`/cards/${drawnCard.slug}`} className="button">
                Read Deep Interpretation
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardContainer} onClick={handleDraw}>
        <div className={!drawnCard ? styles.unpulled : ''} style={{ width: '100%', height: '100%' }}>
          <TarotCard 
            cardName={drawnCard ? drawnCard.name : ""} 
            imagePath={drawnCard ? resolveCardImageUrl(drawnCard.image) : "https://img.dailytarot.org/cards/card-back-external-cropped.webp"} 
            isFlipped={isFlipped}
            titleOffsetBottom={drawnCard ? (drawnCard as any).titleOffsetBottom : undefined}
          />
        </div>
      </div>
    </section>
  );
}
