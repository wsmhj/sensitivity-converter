# Turnmatch — sensitivity converter

Current delivery: complete local workflow. See [full verification](docs/QA-FULL.md) for18 tests, actual export files and browser evidence. Added FOV convention conversion, measured-yaw calibration, profile rename/update/undo/backup/restore and CSV export.

Local English PC mouse sensitivity tool built with Next.js App Router and TypeScript. Research uses the user's approved Google batch; original design and implementation. No account or public deployment. Feedback uses the existing feedback service.

## Run

Use Node22.22.0 (`.node-version` / `.nvmrc`), then:

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Production preview:

```powershell
npm run build
npm start
```

Stop the existing preview before starting another server on3000. Do not build against a concurrently running development preview; stop it, build, and start the intended mode to avoid mixed cached resources. On this workstation the retained production preview runs on3000.

## Check

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm audit
node scripts/check-site.mjs http://127.0.0.1:3000
npm exec tsx scripts/check-exports.ts http://127.0.0.1:3000
```

The HTTP check requires a running production preview. Browser interaction evidence and limits are in [QA-REPORT](docs/QA-REPORT.md). A successful build does not prove deployment or indexing.

## Structure

- `src/lib/conversion.ts`: validated pure engine,16 named reference profiles plus custom yaw, share schema, numeric display and report.
- `src/components/converter.tsx`: inputs, search/favorites, distance controls, advanced geometry, copy/share, local profiles and comparison.
- `src/components/article.tsx`: English guide, shared FAQ data and source links.
- `src/app`: pages, metadata, original generated OG image, robots/sitemap and theme styles.
- `docs/research`: approved Google audit, control coverage, sources, snapshots and screenshots.
- `docs/qa`: visible text, HTTP/SEO evidence, browser screenshots and print PDF.

## Configure before publication

Copy `.env.example` to `.env.local` and configure real `NEXT_PUBLIC_SITE_URL` (HTTPS production origin) and `NEXT_PUBLIC_CONTACT_EMAIL`. These are public values; never put secrets in a `NEXT_PUBLIC_` variable. Rebuild after changes. No operator identity or email has been invented. Contact page clearly states that the local preview lacks a configured address.

Next16.4.0 / React19.3.0 are pinned. TypeScript6.0.3 is used because the chosen lint parser does not support7.0.2. The replaced Next lint dependency chain had an unpatched development dependency advisory; current npm audit reports0 known vulnerabilities. An official Next security update is scheduled for2026-10-14 and was not yet published at the final registry check: **recheck and apply the supported patch before public deployment**. See [TECHNICAL-DECISIONS](docs/TECHNICAL-DECISIONS.md).

## Scope and limitations

Reference linear PC hipfire scales, explicit DPI/yaw, three input units, rotation or geometric horizontal monitor-distance matching. No automatic ADS/controller conversion, hardware DPI detection, training-performance claim or unverified hundreds-of-games list. Verify the physical turn in your game. Saved settings are local; share links carry validated inputs in a fragment.

TXT, CSV and JSON exports use a validated POST attachment endpoint. Export requests send selected inputs to this site and are not stored in an application database; see Privacy. An actual browser TXT file was obtained and hash-checked; all three production attachment responses were downloaded and validated by the HTTP check. Browser event capture and automated native file selection have environment limits; pasted JSON restore is also available. Browser-generated print PDF was obtained and visually checked.

No Git commit/push, hosting registration or public deployment was performed. See [HANDOFF](HANDOFF.md) for current delivery and open items.

最新需求改进：17 个命名参考档案、8 组填写说明、舍入误差、实测 ADS 助手及移动固定结果栏。21 项测试通过。详见 docs/QA-DEMAND.md；自动逐镜 ADS 规则仍未提供。

全量测试及修复：docs/QA-COMPLETE-AUDIT.md；25项自动测试、291次浏览器断言（含复现及纠正），原生附件接收与文件选择权限限制单列，不标记全链路全通过。

