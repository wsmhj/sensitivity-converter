import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Terms of Use',
  'Read the terms for using Turnmatch, including sensitivity reference limits, saved settings and verification of results in your game.',
  '/terms',
);
export default function Terms() {
  return (
    <article className="info-page">
      <h1>Terms of use</h1>
      <p>Last updated October 14, 2026.</p>
      <h2>A reference calculation</h2>
      <p>
        Turnmatch provides mathematical conversions under the assumptions shown in the tool.
        Profiles, game behavior and hardware settings may change. Check the selected scale and
        verify the physical result before relying on it.
      </p>
      <h2>Limits</h2>
      <p>
        The tool is provided as available, without a guarantee of accuracy for every game
        configuration or uninterrupted operation. It does not guarantee improved performance,
        recommend a universally ideal sensitivity or replace game documentation. Applicable
        mandatory rights remain unaffected.
      </p>
      <h2>Your saved settings</h2>
      <p>
        You control the settings you enter, save and share. Keep a separate report or link when you
        need a lasting record; browser data may be cleared. Game names and marks belong to their
        respective owners and do not imply endorsement.
      </p>
      <p>
        <a href="/contact">Contact information</a>
      </p>
    </article>
  );
}
