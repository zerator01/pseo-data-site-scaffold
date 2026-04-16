"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './TarotCard.module.css';

export interface TarotCardProps {
  cardName: string;
  imagePath: string; // The blank, textless original art
  isReversed?: boolean;
  isFlipped?: boolean;
  titleOffsetBottom?: string;
  onClick?: () => void;
}

export default function TarotCard({
  cardName,
  imagePath,
  isReversed = false,
  isFlipped = false,
  titleOffsetBottom,
  onClick,
}: TarotCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState({ 
    x: 50, 
    y: 50, 
    rotateX: 0, 
    rotateY: 0,
    isHovering: false
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setInteraction({ x: percentX, y: percentY, rotateX, rotateY, isHovering: true });
  };

  const handleMouseLeave = () => {
    setInteraction({ x: 50, y: 50, rotateX: 0, rotateY: 0, isHovering: false });
  };

  return (
    <div 
      className={styles.perspectiveContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div 
        ref={cardRef}
        className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''} ${isReversed ? styles.reversed : ''} ${interaction.isHovering ? styles.interacting : ''}`}
        style={{
          "--mouse-x": `${interaction.x}%`,
          "--mouse-y": `${interaction.y}%`,
          "--rotate-x": `${interaction.rotateX}deg`,
          "--rotate-y": `${interaction.rotateY}deg`,
        } as React.CSSProperties}
      >
        {/* Card Back */}
        <div className={styles.cardBack}>
          <Image src="https://img.dailytarot.org/cards/card-back-external-cropped.webp?v=20260415a" alt="Card Back" fill className={styles.cardImage} priority />
        </div>

        {/* Card Front */}
        <div className={styles.cardFront}>
           <Image src={imagePath} alt={cardName} fill className={styles.cardImage} priority />
           
           {/* CSS Text Overlay: 100% typography consistency across all 78 cards */}
           <div 
             className={styles.nameplateContainer}
             style={titleOffsetBottom ? { "--title-bottom": titleOffsetBottom } as React.CSSProperties : undefined}
           >
             <h3 className={styles.cardTitle}>{cardName}</h3>
           </div>
           
           {/* Dynamic Holographic Glare */}
           <div className={styles.holographicOverlay}></div>
           
           {/* Foil Edge Simulation */}
           <div className={styles.foilEdge}></div>
        </div>
      </div>
    </div>
  );
}
