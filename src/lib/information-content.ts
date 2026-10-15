import type { InformationSection } from '@/components/information-page';

export const privacySections: InformationSection[] = [
  {
    id: 'scope',
    title: 'Scope and practical overview',
    paragraphs: [
      'This policy describes information handled through Sensitivity Converter, including the conversion tool, saved profiles, practice range, file exports, usage statistics and feedback form. It distinguishes data kept inside a browser from information transmitted when a page, script, export or feedback service is requested.',
      'The website currently provides its tools without registration, an account password, a payment form or an advertising integration. A lack of registration does not mean that every visit is anonymous: network requests and usage statistics can contain technical identifiers. External websites reached through reference links follow separate policies.',
    ],
  },
  {
    id: 'calculation-inputs',
    title: 'Calculation inputs and local processing',
    paragraphs: [
      'Game selections, sensitivity, DPI, yaw, turn distance, FOV and matching options are used to calculate results in the browser. Typing these values does not by itself upload a saved profile or submit a feedback message. The application does not read mouse-driver settings, scan installed games or detect actual hardware DPI.',
      'Input validation, conversion formulas, comparison values and the measured-distance helpers run locally. Usage events can separately indicate that a conversion succeeded or that validation failed; the application’s custom event fields do not include the numeric settings entered into the converter. Exporting or voluntarily including settings in feedback creates the separate transmissions described below.',
    ],
  },
  {
    id: 'browser-storage',
    title: 'Browser storage and device access',
    paragraphs: [
      'The website uses local storage for the current conversion setup, named profiles, favorite games and theme choice. These records help restore a visit without an account. Up to 20 profiles can be saved. Profile names are user-entered text; descriptive setup names are preferable to personal identifiers.',
      'Local storage is associated with the website origin and browser profile. It has no application-defined expiry for saved converter data. It can remain until cleared, overwritten or removed by the browser. Private browsing, storage restrictions, extensions, low-storage cleanup and browser changes can prevent persistence or remove records. Local saving is not a backup guarantee.',
      'Another person using the same browser profile may be able to open saved settings. Separate browser profiles and device access controls are appropriate on shared devices. Sensitivity Converter does not provide account-based access control or cloud synchronization for local profiles.',
    ],
  },
  {
    id: 'analytics',
    title: 'Usage statistics and technical identifiers',
    paragraphs: [
      'The website loads a usage-statistics script delivered through Supabase infrastructure. The current integration enables statistics automatically; there is no on-page analytics preference panel. The script first attempts to obtain a valid site configuration. If configuration is unavailable or requests are blocked, events may not be delivered.',
      'When active, the script assigns a random visitor identifier in local storage and a session identifier in session storage. It records page-view events, normalized page paths, event times, selected control identifiers, active engagement duration and maximum scroll depth. Sessions are renewed after approximately 30 minutes of inactivity. A visitor identifier is not a name, but it can associate activity across visits in the same browser.',
      'Feature events describe outcomes such as conversion success, validation errors, copying, sharing, profile saving or importing, and practice lifecycle actions. A completed practice event may include a hit count. Custom feature events use an allowlist and do not include profile names, search text, feedback text, complete share links, raw pointer movement or full practice reports. The reviewed script does not record typed text or create session-replay recordings.',
      'Query strings and URL fragments are excluded from the analytics route field. The script also replaces some dynamic-looking path segments with generic labels. Requests to the script and collection services still involve network metadata. Removing identifiers from an event body does not prevent infrastructure from receiving an IP address when handling a request.',
    ],
  },
  {
    id: 'privacy-controls',
    title: 'Cookies, storage choices and privacy signals',
    paragraphs: [
      'The converter’s own persistence uses browser storage rather than an account cookie. The reviewed analytics script also uses local and session storage, and its network requests omit browser credentials. This description is not a claim that hosting or other infrastructure can never use cookies or technical request records.',
      'The analytics script checks the Global Privacy Control signal and suppresses analytics event collection when that signal is present. Loading the script itself can still create a network request. The website does not claim to recognize every browser privacy signal, and a Do Not Track preference should not be assumed to have the same effect.',
      'Browser controls or content-blocking tools can restrict storage and third-party requests. Blocking analytics should not prevent local calculations. Blocking all scripts can prevent interactive conversion, saving, feedback and practice. Clearing a visitor identifier does not delete previously received events and does not prevent a new identifier from being created on a later eligible visit.',
    ],
  },
  {
    id: 'sharing',
    title: 'Shared links and clipboard access',
    paragraphs: [
      'A share link contains encoded conversion settings in the URL fragment after the # character. Encoding is not encryption. Anyone who receives the complete link can recover the included settings. A shared calculation link does not automatically include all saved profiles, feedback messages or practice history.',
      'URL fragments are not included in an ordinary HTTP request for the page. The website reads the fragment in the browser to restore the calculation. Browser history, clipboard managers, extensions, screenshots, messaging services or link recipients may nevertheless retain the full link. A recipient can copy or redistribute it, and the website has no link-revocation mechanism.',
      'Copy buttons write the selected result or share link to the clipboard when requested. Browser permission or clipboard restrictions can block the operation. Data copied out of the website is subject to the behavior of the device, browser and destination application.',
    ],
  },
  {
    id: 'files',
    title: 'Reports, backups, imports and printing',
    paragraphs: [
      'Downloading a TXT report or comparison CSV sends the selected calculation inputs to the website’s export endpoint. Downloading a profile backup sends the included profile identifiers, names and settings. These requests are necessary for the current server-generated attachment workflow, even though the underlying calculations are available locally.',
      'The export endpoint validates the submitted payload and returns an attachment. It does not write that payload to an application database, and the response instructs caches not to store it. This does not establish that all hosting logs, security systems or downloaded copies are automatically erased.',
      'A backup selected for import is read by the browser. Pasted backup text is also parsed locally. The import operation itself does not upload the entire backup to a server. Importing can add local profiles; existing data and capacity limits affect the result. A later backup export sends the selected saved profiles as described above.',
      'Downloaded files remain in the location chosen by the browser or device. Printing invokes the browser’s print workflow. A selected printer, PDF destination or print service may receive the printed content. Clearing website storage does not delete files, clipboard entries, printed copies or copies held by a recipient.',
    ],
  },
  {
    id: 'practice',
    title: 'Practice range data and mouse access',
    paragraphs: [
      'The practice range uses relative mouse movement and clicks to update the scene and calculate round statistics. Mouse capture starts through a practice action and can be released through browser controls. Optional raw-input support and fullscreen behavior depend on the browser. The website does not request camera or microphone access for practice.',
      'Round results, comparison history and optional turn-comfort observations are held in the current page session. Reloading the page clears those session reports. They are not a durable record or a cloud profile. Saving or applying a setup changes converter settings; it does not create a cloud archive of the full practice report.',
      'Practice-related usage events are described in the statistics section. Local processing of movement and reports should not be confused with an absence of all practice-related telemetry.',
    ],
  },
  {
    id: 'feedback',
    title: 'Optional feedback messages',
    paragraphs: [
      'Submitting feedback sends the entered message, website domain and page origin/path to a feedback service using Supabase infrastructure. Query strings and fragments are removed from the automatically attached page address. If a complete link or personal information is typed into the message itself, it becomes part of the submitted content.',
      'Opening the form does not submit a message. The form does not require an account or email address and currently accepts text rather than file attachments. A successful submission stores the message for review; it does not publish the message as a public comment.',
      'Feedback can be used to investigate reported problems, consider corrections or suggestions, and review abuse or privacy concerns. Do not submit passwords, access tokens, payment details, identity documents, private conversations or another person’s personal information. Network metadata may be processed to deliver the request and apply abuse controls.',
      'A success notice confirms acceptance of the request, not a promised answer, repair or review deadline. Anonymous feedback has no user-facing inbox or message-status page. Without a suitable reply route, an individual response cannot be assumed.',
    ],
  },
  {
    id: 'purposes-recipients',
    title: 'Processing purposes and service recipients',
    paragraphs: [
      'Information is used to deliver requested pages and attachments, remember selected settings, measure feature usage, understand errors, support feedback review and protect the service against abuse. The current application does not provide advertising targeting, a profile marketplace or an automated decision system determining access to employment, credit or similar opportunities.',
      'Hosting, network and security services process requests needed to deliver the website. Supabase infrastructure supports the current statistics and feedback integrations. These services may receive technical request information as well as the particular event or message payload. Service providers apply their own infrastructure and account-level controls.',
      'Information may also need to be preserved or disclosed in response to a valid legal obligation, a security incident or an enforceable request. This policy does not assert that every legal request requires disclosure, or that information is publicly accessible merely because it is stored by a service.',
      'The purpose and necessity of processing depend on the activity selected. Reading this policy is not treated as blanket consent to every possible future use. Where applicable requirements call for consent or another condition, the relevant requirement still applies; this notice alone does not establish that such a condition has been satisfied.',
    ],
  },
  {
    id: 'retention',
    title: 'Retention and limits of automatic deletion',
    paragraphs: [
      'Saved converter settings and the analytics visitor identifier can persist in browser local storage without a fixed application expiry. Session identifiers use session storage, subject to browser session restoration behavior. Practice reports are temporary page-session data. Downloads and shared copies remain under the control of the device or recipient.',
      'The application does not currently publish a verified, fixed automatic-deletion period for server-side feedback, collected analytics, hosting logs or provider backups. A submission should not be assumed to disappear when a browser tab is closed or local storage is cleared. The absence of a published period is not a promise of indefinite retention or immediate deletion.',
      'A retention enquiry can identify the record category and approximate submission time through the contact form. The relevant record, processing purpose, unresolved issue, abuse investigation, provider configuration, backup lifecycle and applicable preservation requirements affect whether a record can be located and removed. The website cannot delete copies independently retained by link recipients or external applications.',
    ],
  },
  {
    id: 'clear-data',
    title: 'Removing local information',
    paragraphs: [
      '“Clear saved profiles & favorites” removes the corresponding converter records and restores the default example. It does not clear the theme preference, analytics identifiers, previously submitted feedback or downloaded files. The ordinary Reset button restores example inputs without deleting saved profiles.',
      'Use the browser’s site-data controls to remove remaining local and session storage for the website. Export a backup first if saved profiles need to be kept. Browser cleanup can also remove preferences required to remember prior choices. If storage operations fail, the visible state may change for the visit without changing the stored record; the interface provides an error message when that failure is detected.',
    ],
  },
  {
    id: 'requests',
    title: 'Privacy enquiries and applicable rights',
    paragraphs: [
      'Depending on the requirements that apply to a particular situation, rights may include requesting information about processing, access, correction, deletion, restriction, objection, portability or withdrawal of consent where processing relies on consent. These rights are subject to their actual scope, exceptions and verification requirements. Nothing in this notice removes mandatory rights or prevents raising a concern with an appropriate supervisory body.',
      'Use Contact & feedback and identify the request as a privacy enquiry. Include the data category, approximate date and enough non-sensitive context to distinguish the relevant record. For feedback, a short excerpt may help. Do not submit an entire identity document or sensitive credentials through the general feedback form.',
      'The website has no account that automatically links an anonymous visitor to every server record. A request may therefore require additional information or may not identify a record reliably. The form itself offers no private reply thread. A message should not be treated as proof that deletion has occurred; local records can be cleared directly using browser controls.',
    ],
  },
  {
    id: 'security',
    title: 'Security and responsible disclosure',
    paragraphs: [
      'The application validates supported export and import formats, limits payloads, filters custom analytics fields and removes query/fragment data from automatically attached feedback addresses. These measures reduce particular risks but do not guarantee that every device, transmission, provider or stored copy is secure.',
      'No online service can promise absolute protection against unauthorized access, data loss or service interruption. Protect the device and browser, review shared content and use trusted software. A suspected security issue can be reported through Contact & feedback without exposing credentials, exploiting another visitor’s data or performing disruptive testing.',
    ],
  },
  {
    id: 'external-services',
    title: 'External references and younger visitors',
    paragraphs: [
      'Links to game documentation, source repositories and reference material lead to separate websites. Visiting those destinations may disclose request information to them. Their cookies, storage, account features and privacy practices are not controlled through the converter’s settings.',
      'Sensitivity Converter is a general-purpose mouse-settings reference and has no age-verification or parental-account feature. Younger visitors should avoid submitting personal information and obtain suitable guidance before using optional feedback or sharing features. A concern about a submitted message containing a child’s information can be reported through the privacy enquiry route without adding unnecessary sensitive details.',
    ],
  },
  {
    id: 'policy-changes',
    title: 'Changes to this policy',
    paragraphs: [
      'The date at the top identifies the most recent revision of this page. Material changes to features, processing or service integrations should be reflected in the notice. A future feature is not described as active merely because it could be added later.',
      'Review this policy before submitting new information if the website’s behavior has changed. Changes to a notice do not by themselves replace a consent choice, waive a mandatory right or authorize an incompatible use of previously collected information.',
    ],
  },
];

export const termsSections: InformationSection[] = [
  {
    id: 'scope',
    title: 'Scope of these terms',
    paragraphs: [
      'These terms describe permitted use and limitations of Sensitivity Converter, including its calculator, game reference profiles, helpers, practice range, saved setups, shared links and downloads. The privacy policy separately explains information handling. Feature-specific explanations shown in the interface remain relevant to the calculation selected.',
      'Use the website only if these conditions are acceptable and the activity is permitted under requirements that apply to the visit. If a condition is not acceptable, stop using the affected feature. These terms do not replace mandatory rights or create an agreement where the applicable requirements for agreement have not been met.',
    ],
  },
  {
    id: 'service',
    title: 'What the website provides',
    paragraphs: [
      'Sensitivity Converter is an independent reference tool for PC mouse sensitivity. It applies mathematical relationships between sensitivity, DPI and yaw, with optional physical-distance and horizontal monitor-distance matching. The current website can be used without registering an account or purchasing a subscription.',
      'The website does not install settings in a game, control mouse-driver software, identify actual hardware DPI or certify a game configuration. Entering a value or applying a practice trial changes the website’s calculation; applying that setting in another application remains a separate action.',
    ],
  },
  {
    id: 'inputs',
    title: 'Accurate inputs and verification',
    paragraphs: [
      'A result depends on the values and assumptions supplied. Check source and target games, sensitivity units, DPI, yaw overrides, input mode and FOV convention before relying on a result. A positive numeric value accepted by the form is not proof that the value matches the actual device or game.',
      'After entering a result into a game, reopen the setting to see what the game retained and measure a complete turn where practical. Percentage-based settings, integer sliders and decimal rounding can change the applied value. Fortnite inputs use the displayed percentage; entering 0.04 instead of 4 for 4% represents a different setup.',
    ],
  },
  {
    id: 'reference-limits',
    title: 'Game profiles and reference limitations',
    paragraphs: [
      'Named profiles represent documented reference scales under the stated assumptions. They are not direct measurements of every installed version, platform, input option or modified configuration. A game update, non-default multiplier, custom yaw or different trainer scale can make a reference unsuitable.',
      'The presence of a game name does not imply support for every weapon, optic, ADS mode, platform or controller setting. KovaaK’s uses the specified Quake/Source profile. Siege assumes its stated default multiplier. An unlisted game cannot be treated as supported merely because it shares an engine with a listed game.',
      'Reference coefficients can differ between tools. A difference is a reason to compare assumptions and verify physical movement, not proof that either result is universally accurate. A reported reference issue can be submitted with reproducible conditions and a reliable source.',
    ],
  },
  {
    id: 'matching',
    title: 'Matching methods, calibration and ADS',
    paragraphs: [
      'Rotation matching preserves calculated full-turn distance under a linear input model. Horizontal monitor-distance matching instead preserves a geometric screen relationship at the selected point and can change cm/360. Neither method preserves every aspect of perceived aim, camera motion, recoil, movement, latency or display behavior.',
      'FOV helpers assume a perspective camera and the supplied convention and aspect ratio. A menu value that differs from the actual rendered view can produce an unsuitable result. The geometric model is not a universal conversion for game-specific zoom behavior.',
      'Custom yaw requires a reliable measurement for the exact setup. Repeating a measurement at another sensitivity can help check linearity. The ADS helper estimates proportional adjustments from measured scoped distance while other settings remain unchanged. Nonlinear response, acceleration, caps and optic-specific behavior fall outside that assumption.',
    ],
  },
  {
    id: 'practice',
    title: 'Practice range and interpretation of reports',
    paragraphs: [
      'Practice is an optional browser-based exercise, not a standardized assessment, competitive ranking or guarantee of improvement. Mouse capture, raw input, frame timing, viewport, hardware and operating-system behavior can differ from an actual game. The website does not determine a universally ideal sensitivity.',
      'Reports describe recorded actions and samples from the current session. Small samples, idle time, missed targets and scenario choice affect interpretation. A suggested focus is practice guidance rather than a claim about personal ability. A turn-comfort observation is self-reported and does not alter measured accuracy.',
      'Compare rounds only under matching conditions. Trial multipliers remain separate from the conversion until applied. Applying a trial changes the original match and may require new in-game verification. Reports can disappear on reload; a completed exercise is not a promise of long-term storage.',
      'Take breaks and stop if an exercise causes discomfort, dizziness or strain. Browser capture and fullscreen can be released using the available controls. Practice should not be used while another activity requires attention or safe physical control.',
    ],
  },
  {
    id: 'saved-data',
    title: 'Saved profiles, imports and data loss',
    paragraphs: [
      'Saved profiles, favorites and preferences belong to the current browser storage context. There is no account recovery or cloud synchronization. Browser cleanup, storage failure, device loss, extensions, private browsing or manual deletion can remove them. Keep a separate backup of any setup that matters.',
      'Review imported backups and use files from a trusted source. The website validates its supported format and capacity, but a valid file can still contain settings unsuitable for a game. Import success confirms acceptance of supported data, not the quality or safety of every setting.',
      'Resetting the calculator and clearing saved data are different operations. Read the confirmation before clearing records. An Undo control, when available, applies only to the currently supported change and session; it is not a general recovery service after a page reload or device cleanup.',
    ],
  },
  {
    id: 'exports-sharing',
    title: 'Exports, printing and shared links',
    paragraphs: [
      'Reports, comparison files and profile backups are snapshots of the selected data. They can become outdated after inputs, references or game settings change. CSV comparisons use rotation matching even when the main calculator uses another matching method. Read the file’s context before treating a number as interchangeable with another result.',
      'Shared links contain readable encoded settings and can be forwarded by recipients. They do not have an expiry, password or revocation feature provided by the website. Downloaded, printed and copied information remains outside the website’s direct control after it is saved or shared.',
      'Review profile names and included values before exporting or sharing. The export process sends its selected payload to the website’s endpoint as explained in the privacy policy. A successful download request does not guarantee that a browser, download manager or printer completed the final save.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use and service protection',
    paragraphs: [
      'Use the website for lawful reference calculations, personal setup comparisons, supported exports and constructive feedback. Use must not interfere with another visitor, compromise information or evade reasonable technical safeguards.',
    ],
    items: [
      'Do not attempt unauthorized access to stored feedback, analytics, infrastructure or another visitor’s data.',
      'Do not submit malicious code, stolen credentials, unlawful content, targeted harassment or another person’s sensitive information.',
      'Do not flood forms or endpoints, deliberately exceed service limits, bypass abuse controls or perform disruptive load testing without authorization.',
      'Do not misrepresent results as official game certification, guaranteed performance gains or evidence of an affiliation that does not exist.',
      'Automated access must respect published crawler instructions and technical limits; public availability is not unlimited permission to copy or overload a service.',
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback, suggestions and corrections',
    paragraphs: [
      'Feedback is optional. Submit only material that can lawfully be shared for review. The message and attached page context can be processed to investigate issues, consider improvements and address concerns. Submitting feedback does not transfer ownership of unrelated material or create a right to compensation, a partnership or a guaranteed feature.',
      'A suggestion may overlap with an existing idea or another submission. Feedback is not a confidential channel for trade secrets, passwords or private documents. The form does not establish a public comment, support account or private reply thread.',
      'A submission-success notice is not an undertaking to respond within a particular period, implement a suggestion or resolve an issue. A failed or timed-out submission may need to be retried, while repeated identical submissions can trigger abuse controls.',
    ],
  },
  {
    id: 'content-rights',
    title: 'Website content and third-party names',
    paragraphs: [
      'The website’s presentation, explanatory text and other original materials may be protected by applicable intellectual-property rules. Public access does not place every element in the public domain. Any separately published license applies to the material it actually covers; these terms do not invent a license for an external repository or game.',
      'Results and exports are provided for applying, comparing and documenting the selected settings. Do not remove context in a way that falsely presents a reference result as a guarantee. Linking to the website is permitted when the link does not falsely suggest endorsement or disguise its destination.',
      'Game names, product names and associated marks belong to their respective rights holders. Their use identifies reference profiles and relevant documentation. Sensitivity Converter is independent of the named games and their publishers unless a specific relationship is expressly stated.',
    ],
  },
  {
    id: 'external-links',
    title: 'External websites and services',
    paragraphs: [
      'Reference links are provided to help explain coefficients, assumptions and input behavior. External pages can change, become unavailable, require an account or apply their own terms. Inclusion of a link does not certify every statement, download or service at its destination.',
      'External transactions, downloads and accounts are separate from the calculator. Review the destination and its policies before sharing information or installing software. The website does not require a game-account password to perform a conversion.',
    ],
  },
  {
    id: 'availability',
    title: 'Availability and changes to features',
    paragraphs: [
      'The website is provided on an available-service basis. Maintenance, browser incompatibility, connectivity failures, provider outages and abuse protection can interrupt some features. There is no guaranteed uptime, support response time or permanent availability of a particular profile or feature.',
      'Features, validation rules, reference values and file formats may change to correct issues or reflect supported behavior. Retain useful exports and check the currently displayed assumptions after an update. A future paid feature would need its own disclosed conditions; these terms do not authorize an undisclosed charge.',
    ],
  },
  {
    id: 'warranties',
    title: 'Accuracy and warranty limitations',
    paragraphs: [
      'To the extent permitted by applicable requirements, the website and its outputs are provided without a promise that they are error-free, uninterrupted, suitable for every purpose or accurate for every configuration. Mathematical precision within a model is different from physical accuracy on a particular device.',
      'The website does not guarantee improved aim, tournament outcomes, compatibility with every game update or compliance with a separate game’s rules. Verify important settings independently. Nothing in this section excludes a warranty or obligation that cannot lawfully be excluded.',
    ],
  },
  {
    id: 'liability',
    title: 'Responsibility and mandatory protections',
    paragraphs: [
      'Use of a reference result, saved setup or practice suggestion requires judgment about the actual device and game. Incorrect inputs, unsupported assumptions, overwritten settings, unavailable backups and reliance on an outdated export can lead to unsuitable results or lost time.',
      'To the extent permitted by applicable requirements, responsibility for indirect or consequential losses arising from use or inability to use the website is limited. This does not exclude responsibility that cannot lawfully be limited, remove mandatory consumer protections, or require a visitor to surrender a legally available remedy.',
      'These terms do not impose an automatic duty to pay unlimited damages, a blanket indemnity, a mandatory arbitration procedure or a waiver of every possible claim. Any dispute must be evaluated under the requirements actually applicable to it.',
    ],
  },
  {
    id: 'access-restrictions',
    title: 'Restrictions and discontinuing use',
    paragraphs: [
      'Requests or access may be restricted when needed to address abuse, security incidents, unlawful activity or service capacity. Restrictions can affect shared networks and do not necessarily indicate deliberate misconduct by every person on that network.',
      'A visitor can stop using the website, remove local site data and avoid optional submissions. Stopping a visit does not retract previously shared links, delete downloaded copies or automatically remove server-side feedback and analytics. Privacy enquiries follow the process described in the privacy policy.',
    ],
  },
  {
    id: 'interpretation',
    title: 'Interpretation and revisions',
    paragraphs: [
      'If a provision cannot be applied lawfully, the remaining provisions should be read only to the extent they remain valid and appropriate. A delay in addressing an issue does not automatically waive a right or make prohibited conduct acceptable.',
      'The revision date identifies the current text. Review the terms after a material change to the website. A later revision does not by itself remove accrued mandatory rights or make a new restriction retroactively enforceable.',
    ],
  },
  {
    id: 'questions',
    title: 'Questions about these terms',
    paragraphs: [
      'Use Contact & feedback to identify the relevant section and explain a question, correction or concern. Include only information needed to understand the issue. The contact form is the website’s published enquiry route and does not require an email address.',
      'The absence of an account or reply thread can limit individual follow-up. A submitted enquiry is not confirmation that a dispute has been resolved or that a particular response deadline has been agreed. Mandatory rights remain unaffected.',
    ],
  },
];

export const aboutSections: InformationSection[] = [
  {
    id: 'purpose',
    title: 'Purpose of the website',
    paragraphs: [
      'Sensitivity Converter helps translate a familiar PC mouse setup into a reference setting for another supported game. The starting point is physical movement: how far the mouse travels for a full turn. Explicit DPI and yaw inputs make the assumptions visible rather than treating equal sensitivity numbers as equivalent.',
      'The website combines conversion, explanations and practical verification in one place. It is an independent tool, with no account requirement or claim that a mathematical match guarantees identical aim.',
    ],
  },
  {
    id: 'method',
    title: 'Calculation method',
    paragraphs: [
      'For rotation matching, target sensitivity equals source sensitivity × source yaw × source DPI ÷ target yaw ÷ target DPI. The full-turn relationship is cm/360 = 914.4 ÷ sensitivity ÷ yaw ÷ DPI. Inches are obtained by dividing centimeters by 2.54.',
      'This model assumes linear mouse input. Yaw is degrees turned per mouse count at sensitivity 1. Calculations retain full precision internally; the decimal selector affects presentation. eDPI is useful within a game scale, but equal eDPI across unrelated scales does not establish equal turn distance.',
    ],
  },
  {
    id: 'references',
    title: 'Reference profiles and evidence',
    paragraphs: [
      'The website includes 17 named reference profiles and a custom measured-yaw option. Profile notes and source links describe the assumptions. A reference is not a direct measurement of the current installation, and an engine relationship alone does not prove that an unlisted game shares a supported coefficient.',
      'Examples include default CS2 yaw, the listed VALORANT reference, Fortnite’s displayed percentage, KovaaK’s Quake/Source profile and Siege’s default multiplier. Differences between reference sources should be checked rather than averaged without explanation. The homepage’s Sources and profile assumptions section provides the supporting links.',
    ],
  },
  {
    id: 'tools',
    title: 'Available tools',
    paragraphs: [
      'The main calculator accepts game sensitivity, centimeters per turn or inches per turn. Source and target DPI can differ. Game swapping, precision controls and distance locking support comparisons without re-entering every field.',
      'Advanced tools include horizontal monitor-distance matching, FOV convention conversion, measured-yaw calibration, reverse calculation and a proportional ADS helper using supplied measurements. The retained-value check shows how in-game rounding affects distance.',
      'A comparison table, local profiles, share links and TXT, CSV and JSON exports make settings easier to review and retain. The practice range offers precision, moving-target, switching and turn exercises with session-based reports. Each feature’s limitations are explained beside its controls.',
    ],
  },
  {
    id: 'limitations',
    title: 'What the website does not establish',
    paragraphs: [
      'The website does not detect actual DPI, modify a game automatically, model controller curves or universally translate per-optic ADS behavior. It does not establish a nonlinear response curve from one measurement. Hardware, acceleration, FOV, zoom, latency and frame timing can change the perceived result.',
      'Practice suggestions reflect recorded samples, not a validated ranking or an ideal-sensitivity diagnosis. A limited sample should not be treated as proof of ability. Apply a reference setting, verify physical movement and make deliberate adjustments only after checking the underlying assumptions.',
    ],
  },
  {
    id: 'data',
    title: 'Data and independence',
    paragraphs: [
      'Calculations and imported-file parsing run in the browser. Saved profiles remain in local browser storage. Export generation, usage statistics and optional feedback involve separate requests described in the privacy policy. The website should not be described as entirely offline or as collecting no data.',
      'Game names identify relevant reference scales and remain the property of their rights holders. Sensitivity Converter is not affiliated with the named games or their publishers. Source links provide context rather than an endorsement relationship.',
    ],
  },
  {
    id: 'corrections',
    title: 'Corrections and reproducible reports',
    paragraphs: [
      'A useful correction identifies the exact game profile, sensitivity, DPI, matching method, relevant yaw or FOV settings and the measured difference. An authoritative reference or repeatable test helps distinguish a coefficient issue from rounding, units or a modified input setting.',
      'Use the contact page to submit a report or suggestion. Submitting a report does not promise an immediate change, and undocumented support should not be inferred before a profile is added and its assumptions explained.',
    ],
  },
];

export const contactSections: InformationSection[] = [
  {
    id: 'channel',
    title: 'Feedback channel and response expectations',
    paragraphs: [
      'The Give feedback button opens the website’s text feedback form. No account or email address is required. The current form accepts a message of up to 5,000 characters and does not offer file attachments, a public comment thread or an account-based support inbox.',
      'A success message indicates that the request was accepted. It does not guarantee a personal reply, a response time or implementation of a suggestion. Anonymous messages without a reply route cannot be assumed to receive individual follow-up. This form is not an emergency service.',
    ],
  },
  {
    id: 'conversion',
    title: 'Reporting a conversion discrepancy',
    paragraphs: [
      'Describe the expected result, the displayed result and how the physical distance was measured. Include enough conditions to reproduce the calculation. A mismatch alone does not establish an incorrect coefficient: percentage units, target DPI, rounding and a modified game scale can explain a difference.',
    ],
    items: [
      'Source and target game profiles, including the selected trainer scale or known game version.',
      'Source sensitivity or turn distance, input unit, source DPI and target DPI.',
      'Rotation or monitor-distance matching, both FOV values and the match percentage when relevant.',
      'Any yaw override, custom multiplier, retained in-game value and measured cm/360.',
      'A reproducible sequence or reference link; remove unrelated personal information before submitting.',
    ],
  },
  {
    id: 'interface',
    title: 'Reporting a button, display or download problem',
    paragraphs: [
      'Identify the page and control, the steps immediately before the failure, the expected behavior and any visible error text. Browser name/version, device category, viewport size and whether the problem repeats after a refresh can help describe the conditions.',
      'For an export, specify TXT, CSV or JSON and distinguish a failed request from a file saved in an unexpected download location. For an import, specify whether the file selector or pasted-text route was used. Do not submit an entire private backup when a small description of the error is sufficient.',
      'If a screenshot would help, describe the relevant part in text; the current form has no attachment upload. Do not paste unrelated browser history, account pages or private conversations.',
    ],
  },
  {
    id: 'practice',
    title: 'Reporting a practice-range problem',
    paragraphs: [
      'Include the scenario, trial multiplier, FOV, raw-input choice and whether fullscreen was active. Describe whether the issue occurred before mouse capture, during a round, after pausing or in the completed report. Browser focus and mouse-capture permissions can affect startup.',
      'For a scoring concern, distinguish shots, hits, tracking time and self-reported turn observations. Report the visible values and the action that produced them. Session reports clear on reload, so note the relevant details before leaving the page. Avoid treating a small sample as a reliable comparison of sensitivity settings.',
    ],
  },
  {
    id: 'suggestions',
    title: 'Suggestions and new game references',
    paragraphs: [
      'Explain the task a proposed feature would solve, the current obstacle and the expected behavior. For a game-profile suggestion, include a reliable coefficient source or repeatable measurements, the exact input mode and any multiplier assumptions.',
      'A shared engine, a popular game name or a sensitivity value copied from another tool is not enough to establish a supported scale. New references need a clear scope. Suggestions are considered without a guarantee of a release date or implementation.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and record-related enquiries',
    paragraphs: [
      'Begin the message with “Privacy enquiry” and identify the relevant data category. An approximate submission date and a short non-sensitive excerpt can help locate feedback. State whether the request concerns access, correction, deletion or an explanation of processing.',
      'Local settings can be removed directly through the website’s clear-data control and the browser’s site-data settings. A server-side enquiry is separate: clearing a browser does not erase feedback already submitted. Anonymous records may be difficult to associate with a requester, and the form provides no private status thread.',
      'Do not send identity documents, passwords or access tokens to prove a request. The privacy policy explains the available route and its limitations. A submission is not confirmation that a record has been found or removed.',
    ],
  },
  {
    id: 'security-rights',
    title: 'Security and content concerns',
    paragraphs: [
      'For a suspected security issue, describe the affected feature and a minimal, non-destructive reproduction. Do not access another visitor’s information, submit live secrets, perform disruptive testing or publish an exploit through the feedback form.',
      'For a content or rights concern, identify the specific page or passage, the material concerned and the reason for the report. Include an appropriate reference when available. Do not imply ownership of material that cannot lawfully be represented. The form does not provide a public takedown tracker or guarantee a particular outcome.',
    ],
  },
  {
    id: 'submission-data',
    title: 'Information attached to a submission',
    paragraphs: [
      'The feedback service receives the entered text together with the website domain and page origin/path. Query strings and fragments are removed from the automatically attached address. A full link pasted into the message remains part of the text, so inspect it before sending.',
      'Opening the form does not submit a message. Sending is optional. Submissions are stored for review through the feedback service described in the privacy policy; feedback is not published as a visitor comment. Avoid sensitive personal information and use only the details needed to explain the issue.',
    ],
  },
  {
    id: 'failed-submission',
    title: 'When a message does not send',
    paragraphs: [
      'Check that the message is not empty and stays within the displayed length limit. Network restrictions, content blockers, timeouts or service limits can prevent delivery. Keep a private copy of the message if it matters before refreshing or closing the form.',
      'A timeout does not always prove that a server received nothing. Avoid repeated rapid retries; a duplicate message may be stored if a prior request completed without its confirmation reaching the browser. Follow any rate-limit notice and try again later. The current service can limit a network to 10 messages per hour.',
      'The converter can still be used when optional feedback is unavailable. No public email address or alternative ticket system is published by this page.',
    ],
  },
];
