import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };

export default function Contact() {
  return (
    <article className="info-page">
      <h1>Contact &amp; feedback</h1>
      <p>
        Found a problem or have an idea? Send a message through our feedback form. No account or
        email address is needed.
      </p>
      <button
        type="button"
        className="feedback-open-button"
        data-feedback-open
        data-analytics-id="contact_feedback"
        aria-haspopup="dialog"
      >
        Give feedback ↗
      </button>
      <h2>Reporting a conversion issue</h2>
      <p>
        Include both game profiles, source sensitivity or distance, source and target DPI, matching
        method, custom coefficients and the result you measured. The downloadable report keeps these
        conditions together.
      </p>
      <p>
        A share link contains your selected setup. Review its contents before sending it. Do not
        include passwords or private information.
      </p>
      <p>
        <a href="/privacy">How feedback is handled</a>
      </p>
      <a href="/#converter">Return to the converter</a>
    </article>
  );
}
