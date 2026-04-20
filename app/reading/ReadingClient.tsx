'use client';

import React, { useState } from 'react';
import cards from '@/../data/tarot-cards.json';
import TarotCard from '@/components/TarotCard';
import { resolveCardImageUrl } from '@/lib/card-images';
import styles from './Reading.module.css';

const positions = ['Past', 'Present', 'Future'] as const;

function drawThreeUniqueCards() {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }

  return shuffled.slice(0, 3);
}

export default function ReadingClient() {
  const [drawnCards, setDrawnCards] = useState(() => drawThreeUniqueCards());
  const [flippedIndex, setFlippedIndex] = useState<number>(-1);

  const handleCardClick = (index: number) => {
    if (index === flippedIndex + 1) {
      setFlippedIndex(index);
    }
  };

  const handleDrawAgain = () => {
    setDrawnCards(drawThreeUniqueCards());
    setFlippedIndex(-1);
  };

  return (
    <div className={styles.readingLayout}>
      <div className={styles.spreadContainer}>
        {positions.map((label, index) => {
          const isFlipped = flippedIndex >= index;
          const card = drawnCards[index];
          const imagePath = resolveCardImageUrl(card.image);

          return (
            <div key={label} className={styles.positionWrapper}>
              <span className={styles.positionLabel}>{label}</span>
              <TarotCard
                cardName={card.name}
                imagePath={imagePath}
                isFlipped={isFlipped}
                titleOffsetBottom={(card as any).titleOffsetBottom}
                onClick={() => handleCardClick(index)}
              />
            </div>
          );
        })}
      </div>

      {flippedIndex === positions.length - 1 && (
        <div className={styles.readingResults}>
          {positions.map((label, index) => (
            <div key={label} className={styles.resultItem}>
              <div className={styles.resultPosition}>{label}</div>
              <h3 className={styles.resultCardName}>{drawnCards[index].name}</h3>
              <p className={styles.resultMeaning}>{drawnCards[index].meaning.upright.general}</p>
            </div>
          ))}
          <div className="text-center">
            <button className={styles.actionButton} onClick={handleDrawAgain}>
              Draw Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
