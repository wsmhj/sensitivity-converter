import InformationPage from '@/components/information-page';
import { contactSections } from '@/lib/information-content';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Contact & Conversion Feedback',
  'Report conversion issues, website problems, privacy concerns or feature suggestions through the Sensitivity Converter feedback form. No account or email is required.',
  '/contact',
);

export default function Contact() {
  return (
    <InformationPage
      title="Contact &amp; feedback"
      introduction="Use the feedback form to report a problem, request a correction or suggest an improvement to Sensitivity Converter. The guidance below explains what to include and how submissions are handled."
      sections={contactSections}
    >
      <button
        type="button"
        className="feedback-open-button"
        data-feedback-open
        data-analytics-id="contact_feedback"
        aria-haspopup="dialog"
      >
        Give feedback ↗
      </button>
    </InformationPage>
  );
}
