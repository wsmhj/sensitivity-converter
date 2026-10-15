import type { Metadata } from 'next';
import Converter from '@/components/converter';
import Article, { faqs } from '@/components/article';
import { site } from '@/lib/site';
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: site.title,
    description: site.description,
    type: 'website',
    siteName: site.name,
  },
};
export default function Home() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: site.name,
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
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: site.name,
      alternateName: new URL(site.origin).hostname,
      url: site.origin,
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${site.origin}/#webpage`,
      url: site.origin,
      name: site.title,
      description: site.description,
      isPartOf: { '@id': `${site.origin}/#website` },
      dateModified: '2026-10-15',
      inLanguage: 'en',
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
          <p>
            Convert your PC mouse settings between games, match cm/360 and adjust for a new DPI.
            Free to use, with no account required.
          </p>
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
