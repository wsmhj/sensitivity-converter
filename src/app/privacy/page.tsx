import InformationPage from '@/components/information-page';
import { privacySections } from '@/lib/information-content';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Privacy Policy',
  'How Sensitivity Converter handles local settings, analytics, exports, shared links and feedback, including storage choices and privacy enquiries.',
  '/privacy',
);

export default function Privacy() {
  return (
    <InformationPage
      title="Privacy policy"
      introduction="This policy explains what information Sensitivity Converter handles, why it is used, where browser storage differs from server processing, and the choices available to visitors."
      sections={privacySections}
    />
  );
}
