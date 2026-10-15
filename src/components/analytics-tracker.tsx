import Script from 'next/script';

export default function AnalyticsTracker() {
  return (
    <Script
      id="turnmatch-analytics"
      src="https://szqxprjpaccnskjqdrkq.supabase.co/functions/v1/analytics/tracker.js"
      data-consent="granted"
      strategy="afterInteractive"
    />
  );
}
