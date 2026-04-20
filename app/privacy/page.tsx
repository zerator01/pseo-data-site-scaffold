import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn what DailyTarot stores, what third-party services deliver card images, and how local browser storage is used for reading features.',
};

export default function PrivacyPage() {
  return (
    <main className="sectionStack">
      <section className="panel">
        <div className="eyebrow">Privacy</div>
        <h1>Privacy Policy</h1>
        <p className="lede">
          DailyTarot is a content site. We do not require an account to browse the tarot card
          library or use the reading surfaces currently available on the site.
        </p>
      </section>

      <section className="split">
        <div className="panel">
          <h2>What We Store In Your Browser</h2>
          <div className="list">
            <div className="listItem">
              <strong>Daily draw state</strong>
              <span>
                The daily draw feature stores a card slug and a local calendar date in your browser
                so the same card can be shown again later that day.
              </span>
            </div>
            <div className="listItem">
              <strong>No account profile</strong>
              <span>
                We do not ask you to create a login, and we do not maintain a personal tarot
                reading history tied to an account.
              </span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Third-Party Delivery</h2>
          <div className="list">
            <div className="listItem">
              <strong>Card image hosting</strong>
              <span>
                Tarot card images and related assets are served from our image CDN at
                `img.dailytarot.org`, which may process standard request logs needed to deliver the
                files.
              </span>
            </div>
            <div className="listItem">
              <strong>Infrastructure logs</strong>
              <span>
                Like most websites, the hosting and CDN providers may record IP address, user
                agent, referrer, and request timing for security, caching, and operational
                debugging.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Cookies, Analytics, And Changes</h2>
        <div className="list">
          <div className="listItem">
            <strong>Cookies and analytics</strong>
            <span>
              If analytics, advertising, or additional tracking tools are added later, this page
              should be updated before those systems are treated as production-ready.
            </span>
          </div>
          <div className="listItem">
            <strong>Policy updates</strong>
            <span>
              We may update this page as the product changes. Material changes should be reflected
              here before new data collection behavior is relied on in production.
            </span>
          </div>
          <div className="listItem">
            <strong>Contact</strong>
            <span>
              If you need a data or privacy contact channel, add the real support address here
              before treating this site as fully ship-ready.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
