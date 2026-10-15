import { GAMES } from '@/lib/conversion';

export const faqs = [
  [
    'How does the sensitivity converter match VALORANT to CS2?',
    'At equal DPI, the sensitivity converter multiplies by 0.07 ÷ 0.022: VALORANT 0.35 becomes CS2 1.1136363636. Enter both DPI values if they differ.',
  ],
  [
    'Can the sensitivity converter handle 800 to 1600 DPI?',
    'Yes. Within one linear game profile, the sensitivity converter halves sensitivity when DPI doubles: 1.2 at 800 DPI becomes 0.6 at 1600 DPI.',
  ],
  [
    'Why can a sensitivity converter result feel different?',
    'A sensitivity converter matches a chosen measurement. Equal cm/360 does not preserve FOV, zoom, recoil or frame timing; verify the result in your game.',
  ],
  [
    'Will this aim sensitivity converter preserve my aim?',
    'The aim sensitivity converter provides a repeatable starting point, not identical gameplay. Check your DPI, input settings and FOV before adjusting the result.',
  ],
  [
    'Does the sensitivity converter change mouse DPI?',
    'No. Set DPI in your mouse software. The sensitivity converter uses the value you enter to calculate the required in-game setting.',
  ],
  [
    'Why might another sensitivity converter give a different answer?',
    'Compare coefficients and rounding. This sensitivity converter uses VALORANT yaw 0.07; some tools use 0.06996. Different reference assumptions produce different answers.',
  ],
  [
    'Can I use the sensitivity converter for ADS?',
    'The sensitivity converter includes a measured-distance ADS helper. It estimates proportional adjustments for one optic; it cannot automatically translate every weapon or zoom multiplier.',
  ],
  [
    'Is this a controller sensitivity converter?',
    'No. This PC mouse sensitivity converter does not model analog-stick dead zones, acceleration or response curves. Controller settings have no universal mouse conversion ratio.',
  ],
  [
    'Where does Sensitivity Converter save my settings?',
    'Sensitivity Converter stores settings, favorites and profiles in this browser. There is no cloud sync. Download a backup before clearing browser data.',
  ],
  [
    'How accurate is the sensitivity converter?',
    'The sensitivity converter retains full calculation precision. Real accuracy depends on DPI, yaw and game settings. Check the value your game retains after rounding.',
  ],
  [
    'Can the sensitivity converter handle an unlisted game?',
    'Choose the custom option in the sensitivity converter only after measuring a linear yaw for your setup. An arbitrary coefficient cannot establish accurate support.',
  ],
];

const sections = [
  {
    id: 'how-it-works',
    title: 'How to use the sensitivity converter',
    parts: [
      [
        'Enter your current setup',
        'Choose both games and enter your source sensitivity and actual DPI. The sensitivity converter updates immediately; set target DPI separately when changing mouse settings.',
      ],
      [
        'Apply and verify your result',
        'Copy the sensitivity converter result into the target hipfire field. Reopen the game settings to check rounding, then verify one full turn on your mousepad.',
      ],
      [
        'Start from a measured distance',
        'Select cm/360 or in/360 to start from a measured turn distance. The sensitivity converter calculates the corresponding setting using your target profile and DPI.',
      ],
    ],
  },
  {
    id: 'supported-games',
    title: 'Games supported by the sensitivity converter',
    parts: [
      [
        'CS2 and VALORANT sensitivity converter',
        'The CS2 sensitivity converter assumes default m_yaw 0.022; VALORANT uses 0.07. Enter each setup’s DPI and use Swap to check the reverse direction.',
      ],
      [
        'Fortnite sensitivity converter inputs',
        'Enter 4 for a displayed 4%, not 0.04. The Fortnite sensitivity converter covers PC mouse hipfire; building multipliers, controller input and weapon-specific ADS are separate.',
      ],
      [
        'Apex and Overwatch 2 sensitivity converter',
        'Use the Apex sensitivity converter for default hipfire or choose Overwatch 2 as either game. Compare cm/360: equal eDPI across these scales does not mean equal movement.',
      ],
      [
        'Rainbow Six Siege sensitivity converter',
        'The Siege sensitivity converter assumes MouseSensitivityMultiplierUnit 0.02 and an integer horizontal slider from 1–100. Check rounding; a modified multiplier requires a yaw override.',
      ],
      [
        'Call of Duty / Warzone sensitivity converter',
        'Choose the listed PC hipfire reference in the sensitivity converter. Verify it against your installed game; this profile does not cover every release, ADS mode or input curve.',
      ],
      [
        'KovaaK’s sensitivity converter profile',
        'Select Quake/Source in KovaaK’s before applying the sensitivity converter result. Other named profiles include CS:GO, TF2, Titanfall 2 and Quake; shared engines do not establish unlisted support.',
      ],
    ],
  },
  {
    id: 'formula',
    title: 'Sensitivity converter formulas: DPI, eDPI and cm/360',
    parts: [
      [
        'Understand yaw and physical turn distance',
        'Yaw measures degrees per mouse count at sensitivity 1. The sensitivity converter combines yaw, sensitivity and DPI to match rotation; displayed decimals do not change internal precision.',
      ],
    ],
  },
  {
    id: 'examples',
    title: 'Sensitivity converter worked examples',
    parts: [
      [
        'CS2 to VALORANT sensitivity converter example',
        'At 800 DPI, the sensitivity converter maps CS2 1 to VALORANT 0.3142857143: 1 × 0.022 ÷ 0.07. Both measure 51.9545 cm/360. Target DPI 1600 halves the result.',
      ],
      [
        'VALORANT to CS2 sensitivity converter example',
        'At 800 DPI, the sensitivity converter maps VALORANT 0.35 to CS2 1.1136363636, or 46.6531 cm/360. Doubling only source DPI doubles the CS2 result to 2.2272727273.',
      ],
      [
        'Fortnite sensitivity converter example',
        'At 800 DPI, the sensitivity converter maps Fortnite 4% to Overwatch 2 3.3666666667 or Apex 1.01. Each corresponds to 51.4401 cm/360. Enter 4 as the source.',
      ],
      [
        'Overwatch to Apex sensitivity converter example',
        'At 800 DPI, the sensitivity converter maps Overwatch 2 sensitivity 5 to Apex 1.5: 5 × 0.0066 ÷ 0.022. Both give approximately 34.6364 cm/360.',
      ],
      [
        'DPI sensitivity converter example',
        'Select CS2 on both sides. The DPI sensitivity converter maps 1.2 at 800 DPI to 0.6 at 1600 DPI, preserving 960 eDPI and 43.2955 cm/360.',
      ],
      [
        'Distance-based sensitivity converter example',
        'Enter 40 cm/360. With Quake/Source yaw 0.022, the sensitivity converter returns 1.2988636364 at 800 DPI, or 0.6494318182 at 1600 DPI.',
      ],
    ],
  },
  {
    id: 'choose-your-match',
    title: 'Choose your sensitivity converter matching method',
    parts: [
      [
        'Rotation-based sensitivity converter matching',
        'Use the sensitivity converter’s rotation mode to preserve a full turn’s physical distance. FOV, movement and frame timing can still change how aiming feels.',
      ],
      [
        'FOV-aware sensitivity converter matching',
        'The sensitivity converter’s horizontal monitor mode matches near the crosshair at 0% or the screen edge at 100%. Enter actual horizontal FOV; different FOVs change cm/360.',
      ],
      [
        'Measured ADS in the sensitivity converter',
        'Enter your current ADS multiplier, measured scoped cm/360 and desired distance. The sensitivity converter estimates a proportional adjustment. Keep DPI, hipfire and optic unchanged, then remeasure.',
      ],
    ],
  },
  {
    id: 'profiles',
    title: 'Sensitivity converter profiles and verification',
    parts: [
      [
        'Check the reference scale',
        'Sensitivity Converter includes 17 named profiles and a custom option. These are documented coefficients, not measurements of your installation. Follow the references and check your game settings.',
      ],
      [
        'Check the value your game retains',
        'The sensitivity converter’s retained-value helper reports distance error after rounding. Check your exact mode: KovaaK’s uses Quake/Source, while Siege assumes its default multiplier and integer slider.',
      ],
      [
        'Calibrate an unlisted linear game',
        'Measure a full turn at known sensitivity and DPI. The sensitivity converter derives yaw; repeat at another sensitivity to check linearity. One measurement cannot characterize a nonlinear curve.',
      ],
    ],
  },
  {
    id: 'save-share',
    title: 'Save and share your sensitivity converter setup',
    parts: [
      [
        'Keep your settings',
        'Sensitivity Converter saves up to 20 named profiles locally. Rename, update or export a JSON backup. Share links restore inputs on another device; profiles do not sync automatically.',
      ],
      [
        'Take the calculation with you',
        'Download the sensitivity converter report as TXT or print it. CSV comparisons always use rotation matching. File exports send selected values to this site to generate attachments.',
      ],
      [
        'Try the practice range',
        'Open the sensitivity converter’s practice range for precision, tracking, switching and turns. Trials affect the conversion only when applied. Round comparisons last for this page session; verify physical movement in game.',
      ],
    ],
  },
];

export default function Article() {
  return (
    <div className="guide-layout">
      <aside className="contents">
        <span className="section-kicker">THE FIELD GUIDE</span>
        <h2>Understand your match</h2>
        <nav aria-label="Guide contents">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title
                .replace(' in the sensitivity converter', '')
                .replace('Sensitivity converter', 'Conversion')
                .replace('sensitivity converter', 'conversion')}
            </a>
          ))}
          <a href="#faq">Frequently asked questions</a>
          <a href="#sources">Sources &amp; assumptions</a>
        </nav>
        <a className="back-tool" href="#converter">
          ↑ Back to converter
        </a>
      </aside>
      <article className="guide">
        <p className="micro">
          Guide updated <time dateTime="2026-10-15">October 15, 2026</time>.
        </p>
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            {section.id === 'supported-games' && (
              <p>
                This free mouse sensitivity converter includes {GAMES.length - 1} named reference
                profiles plus a measured-yaw custom option. Available profiles:{' '}
                {GAMES.filter((g) => g.id !== 'custom')
                  .map((g) => g.name)
                  .join(', ')}
                . Check each sensitivity converter profile’s assumptions before using the result.
              </p>
            )}
            {section.parts.map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
            {section.id === 'formula' && (
              <div className="formula-block">
                <h3>Sensitivity converter reference equations</h3>
                <p className="formula">s₂ = s₁ × y₁ × DPI₁ ÷ (y₂ × DPI₂)</p>
                <p className="formula">cm/360 = 914.4 ÷ (s × y × DPI)</p>
                <p className="formula">s = 914.4 ÷ (cm/360 × y × DPI)</p>
                <p className="formula">in/360 = cm/360 ÷ 2.54 · eDPI = s × DPI</p>
                <h4>Sensitivity converter calibration and ADS equations</h4>
                <p className="formula">measured yaw = 914.4 ÷ (s × DPI × measured cm/360)</p>
                <p className="formula">
                  new ADS = current ADS × measured scoped cm/360 ÷ desired cm/360
                </p>
                <p>
                  Repeat yaw measurements to check consistency. The ADS estimate assumes
                  proportional response with unchanged DPI, hipfire and optic. For example, a
                  multiplier of 1 at 80 cm/360 becomes 2 for 40 cm/360. Apply it in game and
                  remeasure.
                </p>
                <h4>Sensitivity converter monitor-distance factor</h4>
                <p className="formula">factor = atan(p × tan(FOV₂/2)) ÷ atan(p × tan(FOV₁/2))</p>
                <p>
                  Multiply s₂ by this factor for horizontal screen matching. p is the match
                  percentage divided by 100. At p = 0 use tan(FOV₂/2) ÷ tan(FOV₁/2). Use radians
                  inside trigonometric functions; inputs are horizontal degrees. y is degrees per
                  count at sensitivity 1. These equations assume linear mouse input without
                  acceleration.
                </p>
              </div>
            )}
          </section>
        ))}
        <section id="faq">
          <div className="section-kicker">A FEW THINGS WORTH CHECKING</div>
          <h2>Sensitivity converter questions</h2>
          {faqs.map(([q, a]) => (
            <details className="faq" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <section id="sources">
          <h2>Sensitivity converter sources and assumptions</h2>
          <p>
            Sensitivity converter profiles were reviewed on October 14, 2026. Game coefficients are
            documented reference values from original engine code and aim-training developers, not
            direct measurements made by this site. Follow the profile link in the tool for scope;
            verify the value against your current game.
          </p>
          <ul className="sources">
            <li>
              <a
                href="https://github.com/ValveSoftware/halflife/blob/master/cl_dll/inputw32.cpp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Valve’s original mouse input source
              </a>{' '}
              — input counts, sensitivity and yaw.
            </li>
            <li>
              <a
                href="https://www.kovaak.com/sensitivity-matcher/"
                target="_blank"
                rel="noopener noreferrer"
              >
                KovaaK’s Sensitivity Matcher explanation
              </a>{' '}
              and{' '}
              <a
                href="https://github.com/KovaaK/SensitivityMatcher"
                target="_blank"
                rel="noopener noreferrer"
              >
                original source
              </a>{' '}
              — reference coefficients and measured turn increments.
            </li>
            <li>
              <a
                href="https://store.steampowered.com/news/posts/?appids=824270&enddate=1596483651&feed=steam_community_announcements"
                target="_blank"
                rel="noopener noreferrer"
              >
                KovaaK’s official announcements
              </a>{' '}
              — original Valorant 0.07 profile. Some current tools instead use 0.06996; this
              difference is disclosed, not averaged.
            </li>
            <li>
              <a
                href="https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-3-07/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Riot’s raw-input notes
              </a>{' '}
              — input behavior, not a published yaw constant.
            </li>
            <li>
              <a
                href="https://aimlabs.com/articles/aimlabs/how-to-configure-and-convert-your-sensitivity-in-aimlabs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aimlabs’ game-profile guide
              </a>{' '}
              — manual DPI entry and in-game verification.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
