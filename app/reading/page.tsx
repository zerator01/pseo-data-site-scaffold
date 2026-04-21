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
        <div className={styles.eyebrow}>Three-Card Spread</div>
        <h1 className={styles.title}>Free 3-Card Reading</h1>
        <p className={styles.description}>
          Focus on your question, reveal the cards one by one, and read the spread as a visual
          sequence through past, present, and future.
        </p>
      </header>

      <ReadingClient />
    </main>
  );
}
