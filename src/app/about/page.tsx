import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'About Our Mouse Sensitivity Calculator',
  'Learn how Sensitivity Converter converts PC mouse sensitivity using DPI, yaw and cm/360, with documented game profiles, formulas and clear limits.',
  '/about',
);
export default function About() {
  return (
    <article className="info-page">
      <h1>About Sensitivity Converter</h1>
      <p>
        Sensitivity Converter is an independent PC mouse sensitivity reference tool. It connects
        documented linear game scales through physical turn distance, with explicit DPI and yaw
        inputs.
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
        Sensitivity Converter is not affiliated with the named games or their publishers.{' '}
        <a href="/#sources">Read the sources and assumptions</a>.
      </p>
    </article>
  );
}
