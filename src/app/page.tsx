import type { Metadata } from 'next';
import Converter from '@/components/converter';
import Article, { faqs } from '@/components/article';
import { site } from '@/lib/site';
import AimArt from '@/components/aim-art';
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
          <div className="eyebrow">
            <span /> YOUR AIM. EVERY ARENA.
          </div>
          <h1>
            Sensitivity <br />
            <span className="accent">converter.</span>
          </h1>
          <p>
            Match your turn distance across games. Enter your sensitivity and DPI to get started.
          </p>
          <div className="hero-specs">
            <span>
              <i /> Free to use
            </span>
            <span>No account needed</span>
            <span>PC mouse profiles</span>
          </div>
        </div>
        <AimArt />
      </section>
      <div className="arena-strip">
        <span>BUILT FOR THE SWITCH</span>
        <span className="arena-game">
          <b>CS</b> COUNTER-STRIKE 2
        </span>
        <span className="arena-game">
          <b>V</b> VALORANT
        </span>
        <span className="arena-game">
          <b>A</b> APEX LEGENDS
        </span>
        <span className="arena-game">
          <b>OW</b> OVERWATCH
        </span>
        <a href="#profiles">Explore profiles ↗</a>
      </div>
      <Converter />
      <Article />
    </div>
  );
}
