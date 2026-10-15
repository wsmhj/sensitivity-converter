import InformationPage from '@/components/information-page';
import { aboutSections } from '@/lib/information-content';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'About the Mouse Sensitivity Calculator',
  'Learn how Sensitivity Converter calculates game sensitivity using DPI, yaw and cm/360, with reference profiles, practical tools and documented limits.',
  '/about',
);

export default function About() {
  return (
    <InformationPage
      title="About Sensitivity Converter"
      introduction="Sensitivity Converter is an independent PC mouse sensitivity reference website built around transparent calculations, explicit assumptions and practical verification."
      sections={aboutSections}
    />
  );
}
