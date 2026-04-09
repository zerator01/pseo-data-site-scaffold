import Link from 'next/link';

export function NextSteps({
  items,
}: {
  items: Array<{ href: string; title: string; description: string }>;
}) {
  return (
    <section className="panel">
      <h2>Next Steps</h2>
      <div className="grid">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="card">
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
