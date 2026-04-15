export default function MethodologyPage() {
  return (
    <main className="sectionStack">
      <section className="panel">
        <div className="eyebrow">Methodology</div>
        <h1>How These Tarot Pages Are Structured</h1>
        <p className="lede">
          Each card page is organized around upright and reversed meanings, symbolism, yes-or-no
          framing, and applied interpretations for love, work, money, and health. The aim is to
          make tarot pages easier to browse, compare, and read in context.
        </p>
      </section>

      <section className="split">
        <div className="panel">
          <h2>What Each Card Includes</h2>
          <div className="list">
            <div className="listItem">
              <strong>Upright meaning</strong>
              <span>The core pattern and direct reading when the card appears upright.</span>
            </div>
            <div className="listItem">
              <strong>Reversed meaning</strong>
              <span>The shadow pattern, distortion, or blocked expression of the same archetype.</span>
            </div>
            <div className="listItem">
              <strong>Applied reading areas</strong>
              <span>Separate interpretations for relationships, work, money, and health.</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Editorial Constraints</h2>
          <div className="list">
            <div className="listItem">
              <strong>No filler</strong>
              <span>Pages should move quickly from card identity to actual interpretation.</span>
            </div>
            <div className="listItem">
              <strong>No placeholder routes</strong>
              <span>Navigation should only point to real tarot pages and reading surfaces.</span>
            </div>
            <div className="listItem">
              <strong>Consistent deck structure</strong>
              <span>All 78 cards should follow the same reading framework so comparison stays easy.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
