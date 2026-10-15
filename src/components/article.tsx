import { GAMES } from '@/lib/conversion';

export const faqs = [
  [
    'How do I convert VALORANT sensitivity to CS2?',
    'At equal DPI, multiply by 0.07 ÷ 0.022. VALORANT 0.35 becomes CS2 1.1136363636 using the listed reference values. Enter both DPI values when they differ.',
  ],
  [
    'How does the DPI sensitivity converter handle 800 to 1600 DPI?',
    'For the same linear game profile, halve sensitivity when doubling DPI. A setting of 1.2 at 800 DPI becomes 0.6 at 1600 DPI.',
  ],
  [
    'Why does equal cm/360 feel different in another game?',
    'Equal turn distance does not preserve FOV, zoom, recoil, movement or frame timing. Screen-distance matching answers a different question and may change cm/360.',
  ],
  [
    'Will this keep my aim the same?',
    'It gives you a repeatable starting point under the selected profile. Verify the physical turn in game and adjust only after checking DPI, input settings and FOV.',
  ],
  [
    'Can this tool change my mouse DPI?',
    'No. Set DPI in your mouse software and enter that actual value here. The result tells you which in-game sensitivity to use.',
  ],
  [
    'Why do converters sometimes give different results?',
    'They may use different yaw coefficients, FOV conventions or rounding rules. This VALORANT reference uses 0.07; some tools use 0.06996. Compare assumptions as well as the answer.',
  ],
  [
    'Can I use this as an ADS sensitivity converter?',
    'The scoped-distance helper estimates proportional ADS settings from your own measurements. It does not automatically translate every game’s optic, weapon or zoom multiplier.',
  ],
  [
    'Does this mouse sensitivity converter support controllers?',
    'No. Analog-stick dead zones, response curves and acceleration cannot be mapped to a mouse with a universal ratio. These profiles are for PC mouse input.',
  ],
  [
    'Where are my settings saved?',
    'Current settings, favorites and profiles use this browser’s local storage. They do not sync. Share a setup or download a backup to keep it elsewhere.',
  ],
  [
    'Is the result exact?',
    'Calculations retain full numeric precision, but accuracy depends on actual DPI, the reference coefficient and game settings. Use the retained-value check to see how in-game rounding changes turn distance.',
  ],
  [
    'What if my game is missing?',
    'Choose Custom game if you have measured a linear yaw for your exact setup. Do not assign an arbitrary factor to an unknown or nonlinear scale.',
  ],
];

const sections = [
  {
    id: 'how-it-works',
    title: 'How do I convert mouse sensitivity between games?',
    parts: [
      [
        'Enter your current setup',
        'Choose your source game, enter its in-game sensitivity, and set your actual mouse DPI. Choose the target game and its DPI. This FPS sensitivity converter calculates a reference setting immediately using the selected mouse-input scales. Fortnite uses the displayed percentage: enter 4 for 4%, not 0.04.',
      ],
      [
        'Apply and verify',
        'Copy the result into the target game’s hipfire sensitivity field. Open “Where to enter this result” for instructions and a rounding check. Move your mouse through one full turn in game and compare the distance with the displayed cm/360.',
      ],
      [
        'Start from a measured distance',
        'If you already know your preferred turn distance, select cm/360 or in/360 instead of entering a sensitivity. For a DPI change within one game, select that same game on both sides.',
      ],
    ],
  },
  {
    id: 'supported-games',
    title: 'Which games does the sensitivity converter support?',
    parts: [
      [
        'CS2 and VALORANT sensitivity converter',
        'Convert CS2 sensitivity to VALORANT or use the same tool as a VALORANT to CS2 sensitivity converter. Enter the actual DPI for each setup rather than assuming they match. The CS2 profile uses the default m_yaw; the VALORANT reference uses 0.07. Worked examples below show both directions and explain the reference-scale difference.',
      ],
      [
        'Fortnite to Overwatch or Apex Legends',
        'For Fortnite sensitivity conversion, enter the percentage displayed in the mouse settings. Choose Overwatch 2 or Apex Legends as the target to match a full physical turn, or swap the games to convert back. This uses PC mouse hipfire settings, not controller sensitivity, building multipliers or per-weapon ADS settings.',
      ],
      [
        'Apex Legends and Overwatch 2 mouse settings',
        'The Apex sensitivity converter uses the default hipfire scale. Overwatch 2 uses a separate reference scale, so equal sensitivity numbers or equal eDPI do not mean equal turn distance. For Overwatch to Apex conversion, compare the resulting cm/360 and verify the turn in both games. Scoped hero settings and per-optic multipliers are separate.',
      ],
      [
        'Rainbow Six Siege sensitivity converter',
        'The Rainbow 6 Siege profile assumes MouseSensitivityMultiplierUnit 0.02 and the integer horizontal sensitivity slider from 1 to 100. Use the rounding helper to see how the nearest allowed value affects turn distance. A modified multiplier requires a yaw override; this is not an automatic Siege ADS converter.',
      ],
      [
        'Call of Duty and Warzone PC hipfire',
        'Choose Call of Duty / Warzone for the standard PC mouse hipfire reference scale. Enter your sensitivity and DPI, then select the destination game. Check the scale against your installed game before applying the result: this profile does not promise support for every Call of Duty release, ADS mode or special input curve.',
      ],
      [
        'KovaaK’s and other reference profiles',
        'The KovaaK’s sensitivity conversion applies specifically to its Quake/Source profile. Select that scale in the trainer before entering the result. Other listed presets include CS:GO, Team Fortress 2, Titanfall 2 and Quake. A shared game engine alone does not establish support for an unlisted game.',
      ],
    ],
  },
  {
    id: 'formula',
    title: 'Mouse sensitivity calculator: DPI, eDPI and cm/360',
    parts: [
      [
        'Match physical turn distance',
        'Yaw is the number of degrees turned per mouse count at sensitivity 1. Combining it with sensitivity and DPI gives the angle turned per inch. Rotation matching keeps this physical relationship equal between games. Full precision is retained internally; the decimal selector changes only the displayed result.',
      ],
    ],
  },
  {
    id: 'examples',
    title: 'Game-to-game sensitivity conversion examples',
    parts: [
      [
        'CS2 to VALORANT sensitivity conversion',
        'At 800 DPI on both sides, CS2 sensitivity 1 becomes 0.3142857143 in VALORANT: 1 × 0.022 ÷ 0.07. Both correspond to about 51.9545 cm/360. At target DPI 1600, the VALORANT value halves to 0.1571428571.',
      ],
      [
        'VALORANT to CS2 sensitivity conversion',
        'At equal DPI, VALORANT 0.35 becomes CS2 1.1136363636, about 46.6531 cm/360 at 800 DPI. If the source instead uses 1600 DPI and the target uses 800, the CS2 result doubles to 2.2272727273.',
      ],
      [
        'Fortnite to Overwatch 2 and Apex Legends',
        'At equal DPI, Fortnite 4% becomes Overwatch 2 sensitivity 3.3666666667 or Apex Legends sensitivity 1.01 with these reference coefficients. Enter 4 as the Fortnite source value. At 800 DPI, all three settings correspond to about 51.4401 cm/360.',
      ],
      [
        'Overwatch 2 to Apex sensitivity conversion',
        'At 800 DPI in both games, Overwatch 2 sensitivity 5 converts to Apex Legends sensitivity 1.5. The calculation is 5 × 0.0066 ÷ 0.022, giving about 34.6364 cm/360. Reverse the games to calculate Apex to Overwatch settings.',
      ],
      [
        'DPI sensitivity conversion: 800 to 1600 DPI',
        'CS2 sensitivity 1.2 at 800 DPI becomes 0.6 at 1600 DPI. Both have 960 eDPI and about 43.2955 cm/360. Equal eDPI is useful within the same game scale; across different games, compare cm/360 instead.',
      ],
      [
        'Start from 40 cm/360',
        'With a default Quake/Source profile at 800 DPI, 40 cm/360 corresponds to sensitivity 1.2988636364. At 1600 DPI, it becomes 0.6494318182.',
      ],
    ],
  },
  {
    id: 'choose-your-match',
    title: 'Aim sensitivity matching: cm/360, FOV and ADS',
    parts: [
      [
        'Use rotation matching as your starting point',
        'Equal cm/360 preserves the hand movement for a full turn. FOV, zoom, recoil, movement and frame timing can still make aiming feel different. No conversion can guarantee identical aim across games.',
      ],
      [
        'FOV and horizontal monitor-distance matching',
        'Advanced horizontal monitor matching uses actual horizontal FOV. Zero percent matches the limit near the crosshair; 100% matches the screen edge. This changes cm/360 when FOV differs and does not automatically calculate game-specific ADS multipliers. Use the FOV helper for vertical, diagonal or 4:3-based menu values.',
      ],
      [
        'ADS sensitivity estimates from your measurements',
        'The scoped-distance helper calculates a proportional ADS adjustment from your current multiplier, measured scoped cm/360 and desired distance. It requires your own measurements with the same DPI, hipfire setting and optic. It is not a universal cross-game ADS sensitivity converter and does not detect weapon-specific zoom behavior.',
      ],
    ],
  },
  {
    id: 'profiles',
    title: 'Profiles, limits and verification',
    parts: [
      [
        'Documented reference scales',
        'The list includes 17 named PC mouse reference profiles and a custom option. These are documented coefficients, not measurements of your current installation. Each selector links to its source. A game update, custom multiplier or different trainer profile may change the relevant scale.',
      ],
      [
        'Check the exact mode',
        'Profiles describe hipfire unless otherwise stated. KovaaK’s uses its Quake/Source scale here. Rainbow Six Siege assumes the default multiplier and an integer horizontal slider from 1 to 100. The retained-value helper shows the distance error caused by rounding.',
      ],
      [
        'Calibrate an unlisted linear game',
        'Measure a full turn at known sensitivity and DPI, then use the calibration helper to derive yaw. Repeat at another sensitivity to check linearity. A single measurement cannot establish a nonlinear response curve or the behavior of every optic.',
      ],
    ],
  },
  {
    id: 'save-share',
    title: 'Compare game settings, save profiles and practice your aim',
    parts: [
      [
        'Keep your settings',
        'Save up to 20 named profiles in this browser, rename or update them, and export a JSON backup. A share link restores the calculation inputs on another device. There is no account or cloud sync; keep a backup before clearing browser data.',
      ],
      [
        'Take the calculation with you',
        'Download a TXT report with the inputs and full-precision answer, print it, or export the comparison table as CSV. The comparison table always uses rotation matching, even when the main result uses screen-distance matching. Exports send selected values to this site to generate the attachment.',
      ],
      [
        'Try the practice range',
        'Use “Test this setup” for precision, tracking, switching and turning drills. Trial multipliers do not change the converter until you apply them. Round comparisons last for this page session and are only meaningful under matching conditions. Confirm the physical turn in your actual game.',
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
                This free mouse sensitivity calculator includes {GAMES.length - 1} named reference
                profiles plus a measured-yaw custom option. Available profiles:{' '}
                {GAMES.filter((g) => g.id !== 'custom')
                  .map((g) => g.name)
                  .join(', ')}
                . Select a listed profile in the converter; check its assumptions before using the
                result.
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
                <h3>Your reference equations</h3>
                <p className="formula">s₂ = s₁ × y₁ × DPI₁ ÷ (y₂ × DPI₂)</p>
                <p className="formula">cm/360 = 914.4 ÷ (s × y × DPI)</p>
                <p className="formula">s = 914.4 ÷ (cm/360 × y × DPI)</p>
                <p className="formula">in/360 = cm/360 ÷ 2.54 · eDPI = s × DPI</p>
                <h4>Measured yaw and scoped-distance helpers</h4>
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
                <h4>Horizontal monitor-distance factor</h4>
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
          <h2>Sources and profile assumptions</h2>
          <p>
            Reference profiles were reviewed on October 14, 2026. Game coefficients are documented
            reference values from original engine code and aim-training developers, not direct
            measurements made by this site. Follow the profile link in the tool for scope; verify
            the value against your current game.
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
