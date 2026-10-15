import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy', alternates: { canonical: '/privacy' } };
export default function Privacy() {
  return (
    <article className="info-page">
      <h1>Privacy</h1>
      <p>Last updated October 14, 2026.</p>
      <h2>Browser storage</h2>
      <p>
        Interactive calculations run in your browser. Current settings, saved profiles, favorite
        games and theme preferences use local storage on this device. This version has no account
        system or advertising integrations.
      </p>
      <h2>Share links and files</h2>
      <p>
        Shared settings are encoded in the URL fragment. The converter reads the fragment locally; a
        fragment is not included in an ordinary HTTP request to the site. Anyone receiving the
        complete link can read the selected settings.
      </p>
      <p>
        Downloading a report or comparison sends the selected calculation inputs to this site's
        export endpoint. Backing up profiles sends those profile names and settings. The endpoint
        validates the data, creates the requested attachment and does not store it in an application
        database. Responses use no-store caching. Infrastructure may process requests as described
        below. Imported backup files are read locally in your browser.
      </p>
      <h2>Feedback</h2>
      <p>
        If you choose to send feedback, your message, this website's domain and the current page
        path are sent to our Supabase feedback service and stored for review. URL queries and
        fragments are removed. Sending feedback is optional; opening the form does not submit a
        message. Do not include passwords or sensitive information.
      </p>
      <h2>Clearing data</h2>
      <p>
        Use “Clear saved profiles &amp; favorites” to remove those items and restore the default
        example. Theme preference can be removed through your browser’s site-data controls. Local
        storage does not sync through this application. Downloaded backups remain wherever you save
        them; clearing this site does not remove those files.
      </p>
      <h2>Hosting and external links</h2>
      <p>
        A hosting provider may process ordinary request data such as IP addresses and browser
        information. External reference sites have their own policies. This local preview does not
        configure a production hosting provider.
      </p>
      <p>
        <a href="/contact">Contact information</a>
      </p>
    </article>
  );
}
