import ReadingClient from './ReadingClient';
import styles from './Reading.module.css';

export const metadata = {
  title: 'Free Tarot Reading | Past, Present, Future | Daily Tarot',
  description: 'Experience a three-card tarot reading online. Reveal a randomized past, present, and future spread from the DailyTarot deck.',
};

export default function ReadingPage() {
  return (
    <main className={styles.mainContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Free 3-Card Reading</h1>
        <p className={styles.description}>
          Focus on your question, center your mind, and reveal a randomized three-card spread for
          your past, present, and future.
        </p>
      </header>
      
      <ReadingClient />
    </main>
  );
}
