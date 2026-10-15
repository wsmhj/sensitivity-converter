import type { Metadata } from 'next';
import Converter from '@/components/converter';
import Article, { faqs } from '@/components/article';
import { site } from '@/lib/site';
export const metadata: Metadata = { alternates: { canonical: '/' }, openGraph: { url: '/' } };
export default function Home() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Turnmatch Sensitivity Converter',
      url: site.origin,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'JavaScript enabled',
      isAccessibleForFree: true,
      description: site.description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([name, text]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text },
      })),
    },
  ];
  return (
    <div className="page-width">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <section className="hero">
        <div className="hero-copy">
          <h1>Sensitivity Converter</h1>
          <p>Choose your games. Bring your settings across.</p>
        </div>
        <p className="hero-signature">
          Different game.
          <br />
          <em>Familiar movement.</em>
        </p>
      </section>
      <Converter />
      <Article />
    </div>
  );
}
