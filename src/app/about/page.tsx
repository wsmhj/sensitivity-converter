import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About', alternates: { canonical: '/about' } };
export default function About() {
  return (
    <article className="info-page">
      <h1>About Turnmatch</h1>
      <p>
        Turnmatch is an independent PC mouse sensitivity reference tool. It connects documented
        linear game scales through physical turn distance, with explicit DPI and yaw inputs.
      </p>
      <h2>Check the assumptions</h2>
      <p>
        Every result comes with its inputs, formula and reference profile. Coefficients are
        reference values, not measurements of your particular installation. Custom yaw and
        horizontal screen-distance matching are available when you know the conditions.
      </p>
      <h2>Our scope</h2>
      <p>
        The tool covers linear mouse hipfire profiles. It does not promise improved aim, translate
        controller curves, detect hardware DPI or automatically calculate game-specific ADS
        multipliers. Verify your result in a practice area.
      </p>
      <p>
        Turnmatch is not affiliated with the named games or their publishers.{' '}
        <a href="/#sources">Read the sources and assumptions</a>.
      </p>
    </article>
  );
}
