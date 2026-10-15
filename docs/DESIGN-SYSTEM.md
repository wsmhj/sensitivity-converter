# Current visual direction — quiet utility (2026-10-15)

User-approved redesign: remove decorative firing-range art, promo game strip, HUD corners, acid-lime result backgrounds and condensed uppercase display typography. Lead with a short title and the working converter.

Tokens live in src/app/globals.css; interface presentation is src/app/interface.css (replaces gaming.css); practice presentation is src/app/practice.css. Light is the clean-browser default; saved dark preferences remain honored. Background #f7f8fa, surface white, ink #202724, muted #606b65, accent #306b53, subtle result #eef5f1. Dark mode uses neutral charcoal with muted green. System sans for UI; monospace for numeric data. Main content width1080px; title36px desktop/28px mobile; labels13px; body15px. Controls6px and panels8–10px radii. No decorative animation or new dependencies.

Homepage: navigation → title/description → converter with input modes, source/target and result → secondary tools and optional practice → comparison/saved settings → guide/FAQ → footer. Sharing and saving are secondary buttons; practice dialog controls share the palette while the game viewport stays dark. OG image and favicon use the same restrained colors.

Validation: 63 existing tests, lint, typecheck, production build and formatting pass. Browser connection timed out repeatedly in this session: new desktop/mobile/dark screenshots and interaction checks remain unverified. Historical screenshots below do not represent this redesign.

---
## Superseded visual directions

# Current visual direction — FPS firing range (2026-10-14)

Charcoal #0c0f11, panels #14191d, ink #eef2ef, muted #a1adaf, lines #30393e, acid lime #c4ff52, cyan #67d8e8. Light mode uses #eef0e8/#fafbf5 with accessible olive #42651a. Clean-browser default dark; explicit stored light preference respected. Display Impact/Arial Narrow/Arial Black, body system Arial, numeric Cascadia Code/Consolas/monospace. 1240px desktop max; responsive 1024/760/480 and narrow320 checked. Strong focus outlines, no external fonts, original aria-hidden SVG art, no added motion.

Hero uses two-line primary keyword and firing-range target art; artwork hidden at mobile widths to keep the tool close. Tool uses square HUD corners, step labels, game badges and high-contrast lime result. Comparison/saved panels, field guide, FAQ, footer and information pages use the same tokens. Favicon and OG synchronized. New styles centralized in src/app/gaming.css.

Current evidence: qa/redesign-desktop.png, qa/redesign-tool-desktop.png, qa/redesign-mobile-390.png, qa/redesign-mobile-320-tool.png, qa/redesign-mobile-content.png. Details and limitations: SEO-VISUAL-REFRESH.md.

---
## Historical design notes below (superseded colors and directions retained as history)

# Design system and planned structure

Full edition: measurement helpers nested under advanced, two columns desktop/one mobile; profile rename/actions/backup/paste recovery grouped in saved card, with local status. Comparison and saved cards align at their tops without stretching empty space. Mobile theme target44px. Current screenshots:qa/full-desktop.png,qa/full-measurements.png,qa/full-mobile-390.png,qa/full-backup-320.png.

Current implementation refinement: light accent#c84525 for white-text contrast; dark accent#ff926f with dark primary-action text. Focus3px/offset3px. Global navigation instant after browser QA found scrolling/click races. Mobile buttons at least44px; compact icon/header exceptions remain visual review items. Numeric text uses system monospace; no external font. Original code-generated1200×630 OG graphic and SVG brand/icon. Final screenshots: `qa/desktop.png`, `qa/mobile-390.png`, `qa/mobile-320.png`; remaining tokens below record original planning choices where different.

Direction: precise gaming instrument on a warm, quiet light canvas. Ink typography, coral-orange aim/rotation accent, compact square controls and a dark high-contrast result display. Typography and numbers do the work; original vector crosshair/turn mark, no stock gamer photo or copied mascot.

Observed references: GamingSmart's short input path and progressive details; KovaaK's prominent sensitivity number and physical-distance slider; Aimlabs' sequential mobile flow; Aiming.Pro's cramped two-column mobile controls show why ours must stack. Actual screenshots: research/screenshots. No claim that these are measured reference color values; all tokens below are original choices.

Tokens: canvas#f5f3ef;surface#ffffff;ink#202323;muted#66706e;line#dcded8;accent#e35e38;accent-soft#fff0e9;result#202a28;result-text#f6fff8. Font system sans + monospace numeric; type12/14/16/20/28/44; body1.65; heading1.12. Space4/8/12/16/24/32/48/72. Radius6 controls,12 panels. Maximum width1180, article760. Breakpoints1024/760/480. Focus2px orange with3px offset. CSS feedback120ms; reduce-motion respected; calculations never delayed.

Desktop:
```
header mark/name                 Tool  How it works  FAQ  theme
eyebrow + H1                   reference-note
┌ toolbar: game sens | cm/360 | inches/360         reset ┐
│ FROM game      swap       TO game                     │
│ sensitivity + DPI         target DPI                  │
│ favorites/profile         DARK RESULT + copy          │
│ advanced mode/FOV         cm360 / inches / eDPI        │
│ distance ruler / lock / slider                         │
└ formula details      share / save / report / print     ┘
all-game comparison table / saved profiles
sticky article contents    usage / math / examples / FAQ
footer About Contact Privacy Terms
```
Mobile390/320: header compact; H1 about32px; mode tabs wrap; FROM and inputs→swap→TO/DPI→result/metrics→distance control→advanced/details→actions→comparison→article. All field labels visible, numeric inputmode decimal, targets44px. No fixed bottom bar over results. Long formulas wrap; table uses local scroll rather than widening page. Current site screenshots will be added after implementation.
