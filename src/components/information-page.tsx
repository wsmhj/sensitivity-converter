import Link from 'next/link';
import type { ReactNode } from 'react';

export type InformationSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export default function InformationPage({
  title,
  introduction,
  sections,
  children,
}: {
  title: string;
  introduction: string;
  sections: InformationSection[];
  children?: ReactNode;
}) {
  return (
    <article className="info-page">
      <header>
        <h1>{title}</h1>
        <p className="micro">
          Last updated <time dateTime="2026-10-15">October 15, 2026</time>.
        </p>
        <p>{introduction}</p>
        {children}
      </header>
      <nav className="info-contents" aria-label={`${title} contents`}>
        <strong>On this page</strong>
        <ol>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>
      {sections.map((section, index) => (
        <section id={section.id} key={section.id} className="info-section">
          <h2>
            {index + 1}. {section.title}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.items && (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <nav className="info-related" aria-label="Related information">
        <Link href="/privacy">Privacy policy</Link>
        <Link href="/terms">Terms of use</Link>
        <Link href="/about">About the website</Link>
        <Link href="/contact">Contact &amp; feedback</Link>
        <Link href="/#converter">Return to the converter</Link>
      </nav>
    </article>
  );
}
