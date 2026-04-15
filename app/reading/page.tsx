import ReadingClient from './ReadingClient';
import styles from './Reading.module.css';

export const metadata = {
  title: 'Free Tarot Reading | Past, Present, Future | Daily Tarot',
  description: 'Experience a premium, interactive free tarot reading online. Draw three cards to uncover insights about your past, present, and future.',
};

export default function ReadingPage() {
  return (
    <main className={styles.mainContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Free 3-Card Reading</h1>
        <p className={styles.description}>
          Focus on your question, center your mind, and select three cards to reveal the profound wisdom of the Gilded Shadow deck.
        </p>
      </header>
      
      <ReadingClient />
    </main>
  );
}
