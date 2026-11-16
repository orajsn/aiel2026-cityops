# Senayan source edition

This local branch ports the accepted Senayan v4 experience into the original React/TypeScript/Vite project. Upstream baseline: `markerxz/aiel2026-cityops`, commit `c1c986e59b25ffa413617a3f921fea65c22110e0` (main, 13 November 2026).

The earlier browser-file adaptations and ZIPs remain unchanged. The original notebooks, Bangkok saved camera file and traffic file are preserved. Reviewed notebook variants live under `src/content/notebooks/senayan/`; Senayan camera choices live in `src/content/senayanCameraOverrides.json`.

## Local production preview

Use Node 20 or newer. From this project directory:

```sh
npm ci --ignore-scripts
npm run export:scripts
npm run build
npm run serve:local
```

Open **http://127.0.0.1:8767/**. The local script manager is **http://127.0.0.1:8767/?mode=scripts**.

The local preview starts a relay on port 8092 and proxies it through the same app origin. Both listeners bind only to loopback. The manager uses the explicit local-only identity `local-presenter`; this is a development convenience, not a production login. Local script edits are stored under `.local/follow-data/`, excluded from Git. Saved edits override the exported defaults. Stop the preview with Ctrl+C. `CITYOPS_LOCAL_PORT` and `CITYOPS_RELAY_PORT` can select other distinct ports.

Real phone access from another device requires the later VM/network setup. Browser-based local relay tests do not establish real event-network readiness.

Phone follow currently shows the live Senayan script. Inherited Bangkok slide pictures are hidden until Senayan-specific phone previews are generated, so the audience does not see stale maps or wording.

On the current Windows machine, the npm registry's certificate chain could not be validated. Installation succeeded using `--registry=https://registry.yarnpkg.com --cache ../npm-cache`; the existing lockfile and integrity checks were retained and TLS verification remained enabled. No global npm configuration was changed.

## Development

`npm run dev` runs Vite on loopback port 5174. The Senayan camera endpoint writes only the Senayan file. Traffic-authoring controls are disabled because the mapped road traffic is generated from geographic data. UI saves never commit or push Git changes in this branch. The upstream capture-process manager is not started.

Tests and production builds use the original toolchain:

```sh
npx tsc --noEmit
npm test -- --maxWorkers=2 --minWorkers=1
npm run build
```

The upstream `TimeOfDay.tsx` component was renamed `TimeOfDayController.tsx` here so Windows can distinguish it from the `timeOfDay.ts` data helper.

## Content and sources

The 87-scene order and original asset identifiers remain. The setting uses OpenStreetMap geometry around Fairmont, Sentral Senayan and Kali Grogol; source data and attribution are bundled. Heights, facade details, crossing structure and inspection fixtures remain interpreted. Defects and inspection findings are fictional teaching material. Close-up cutaways hide nearby context buildings for clarity.

Reviewed English material is retained. Changed pages use an explicitly marked English fallback on the Thai phone view until translation is reviewed; original Thai source files remain intact.

## VM handoff boundary

The Jakarta source edition is published on the `main` branch of https://github.com/orajsn/aiel2026-cityops. VM deployment is in progress; the public endpoint and production authentication are pending verification. The VM uses a production build behind a reviewed web-server configuration and a loopback relay, with authentication at the proxy. Do not use this local preview gateway as a public server.

The upstream VM setup/sync scripts describe the Bangkok owner's existing host and can publish changes or alter services. They are retained as reference, not used for this migration. Hostname, TLS, access policy, server paths and service identity will be set when the target VM is supplied.
