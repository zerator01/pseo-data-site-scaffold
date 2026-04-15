'use client';

import React, { useState } from 'react';
import cards from '@/../data/tarot-cards.json';
import TarotCard from '@/components/TarotCard';
import { resolveCardImageUrl } from '@/lib/card-images';
import styles from './Reading.module.css';

const demoCards = ['the-fool', 'death', 'ace-of-wands']
  .map((slug) => cards.find((card) => card.slug === slug))
  .filter((card): card is (typeof cards)[number] => Boolean(card));

export default function ReadingClient() {
  const [flippedIndex, setFlippedIndex] = useState<number>(-1);
  
  // State: 0, 1, 2 for the three cards flipped sequentially
  const handleCardClick = (index: number) => {
    if (flippedIndex < index) {
      setFlippedIndex(index);
    }
  };

  const positions = ["Past", "Present", "Future"];

  return (
    <div className={styles.readingLayout}>
      <div className={styles.spreadContainer}>
        {positions.map((label, index) => {
          const isFlipped = flippedIndex >= index;
          const card = demoCards[index];
          const imagePath = resolveCardImageUrl(card.image);
          
          return (
            <div key={index} className={styles.positionWrapper}>
              <span className={styles.positionLabel}>{label}</span>
              <TarotCard 
                cardName={card.name} 
                imagePath={imagePath}
                isFlipped={isFlipped}
                onClick={() => handleCardClick(index)}
              />
            </div>
          );
        })}
      </div>

      {flippedIndex === 2 && (
        <div className={styles.readingResults}>
          {positions.map((label, index) => (
            <div key={index} className={styles.resultItem}>
              <div className={styles.resultPosition}>{label}</div>
              <h3 className={styles.resultCardName}>{demoCards[index].name}</h3>
              <p className={styles.resultMeaning}>{demoCards[index].meaning.upright.general}</p>
            </div>
          ))}
          <div className="text-center">
            <button className={styles.actionButton} onClick={() => setFlippedIndex(-1)}>
              Draw Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
