# Sensitivity Converter

A PC mouse sensitivity converter with 17 documented reference profiles, custom yaw, dual DPI, cm/360, horizontal screen-distance matching, local profiles and a practice range.

## Local development

Use Node 22.22.0 (see `.nvmrc`), then `npm ci` and `npm run dev`.
The normal local address is http://127.0.0.1:3000. For a production-mode local preview, stop development, run `npm run build`, then `npm start`.

## Checks

```powershell
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
npm audit
node scripts/check-site.mjs http://127.0.0.1:3000
npm exec tsx scripts/check-exports.ts http://127.0.0.1:3000
```

HTTP checks need a running production preview. Pass the expected canonical origin as the third argument to `check-site.mjs` when testing a configured domain.

## Public release

Copy `.env.example` to `.env.local` for local settings. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin and `TURNMATCH_DEPLOYMENT=production` in the hosting environment. `npm run build:release` validates release configuration before building. Vercel production builds also enforce validation. Local and preview builds send noindex metadata and disallow crawling.

Contact uses the existing feedback widget; **no public email is required**. The confirmed public origin is https://sensitivityconverter.me. Register the real production Origin with the existing analytics service before launch and verify ingestion independently from development. Do not modify the separate feedback service or put privileged keys in client files.

Next.js is pinned to 16.4.1, including the October 14 security update. Recheck official advisories before a future release; npm audit alone is not an assurance that every newly announced issue is covered.

## Reliability and limits

- Calculations keep full precision. Reference profiles do not imply current-version in-game verification; evidence and known input rules are in `src/lib/profile-evidence.ts`.
- Profiles stay in this browser. A failed write is explicitly reported as session-only. Clearing all data requires an inline confirmation.
- TXT/CSV/JSON exports use the validated attachment endpoint. A failed or timed-out request stays on the page. A download request is not proof the browser saved the file.
- Practice loads on demand. Its current input, hit rules and respawn timing are preserved. An intentional 180 ms target respawn is different from a stalled frame.
- Add `?range-diagnostics=1` to the local URL to inspect bounded local timing statistics after pausing or completing a round. Callback timing excludes GPU presentation. Diagnostics are not sent to analytics or saved as profiles.

## Development-only regression fixtures

Set `ENABLE_QA=1` when running `next dev`. `/qa-check/reliability` deliberately fails profile writes and sends a rejected export; `/qa-check/clipboard` exercises clipboard errors. Both must return 404 in production. Use a separate local port to avoid modifying normal preview browser storage. Never present fixture data as real player results.

## Structure

- `src/lib`: calculation, profile persistence/evidence, export requests, practice simulation/rendering/reports.
- `src/components`: converter, game picker, profile controls, export UI and lazy practice dialog.
- `src/app`: routes, metadata, base/theme/practice styles.
- `tests`: calculation boundaries, persistence errors, release config, downloads and practice logic.
- `docs/history`: preserved earlier README and handoff records; historical counts are not current acceptance results.

Current implementation and remaining release requirements: [HANDOFF.md](HANDOFF.md).
