import { FreshnessBadge } from '@/components/FreshnessBadge';

export default function MethodologyPage() {
  return (
    <main className="sectionStack">
      <section className="panel">
        <div className="eyebrow">Methodology</div>
        <h1>Document the data before you amplify it.</h1>
        <p className="lede">
          A real launch should explain source coverage, fallback logic, representative ranking
          rules, and estimate boundaries. This sample route exists to force that habit.
        </p>
        <FreshnessBadge />
      </section>

      <section className="split">
        <div className="panel">
          <h2>Minimum methodology sections</h2>
          <div className="list">
            <div className="listItem">
              <strong>Source registry</strong>
              <span>Link to primary and secondary datasets.</span>
            </div>
            <div className="listItem">
              <strong>Fallback chain</strong>
              <span>Show where estimates replace direct measurements.</span>
            </div>
            <div className="listItem">
              <strong>Ranking doctrine</strong>
              <span>Explain why representative and full rankings differ.</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Starter constraints</h2>
          <div className="list">
            <div className="listItem">
              <strong>No fake authority</strong>
              <span>Write as a transparent publisher, not an invented institution.</span>
            </div>
            <div className="listItem">
              <strong>No empty entry points</strong>
              <span>Do not route primary navigation to placeholders.</span>
            </div>
            <div className="listItem">
              <strong>No blueprint drift</strong>
              <span>Keep page ambition aligned with actual data coverage.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
