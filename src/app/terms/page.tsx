import InformationPage from '@/components/information-page';
import { termsSections } from '@/lib/information-content';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Terms of Use',
  'Detailed terms for Sensitivity Converter: calculation assumptions, practice limitations, saved data, sharing, acceptable use and mandatory protections.',
  '/terms',
);

export default function Terms() {
  return (
    <InformationPage
      title="Terms of use"
      introduction="These terms explain the conditions for using Sensitivity Converter and the practical limits of its calculations, reference profiles, practice tools and data features."
      sections={termsSections}
    />
  );
}
