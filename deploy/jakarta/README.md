# Jakarta deployment — verified 16 November 2026

Live application: **https://168.110.192.223/**

- Presenter script manager: https://168.110.192.223/?mode=scripts
- Phone follow: https://168.110.192.223/follow/ (enter the presenter-generated code).
- Presenter credentials were provided privately. No password or password hash is stored here.
- Source: https://github.com/orajsn/aiel2026-cityops, branch `main`.
- Deployed application commit: `ab6510b6305b35752ca092b8a2d99ed8406b0a10`.
- Application release: `/srv/cityops-jakarta/releases/20261116-ab6510b6`.
- Active release link: `/srv/cityops-jakarta/current`.

The later documentation commit records this deployment; it does not change the built application and does not require a redeploy.

## Verified state

Caddy 2.11.9 serves the production Vite bundle from `/srv/cityops-jakarta/current/dist`. Node 22 runs the `cityops-jakarta-follow` service on loopback port 8092. The service working directory is `/var/lib/cityops-jakarta`; persistent script versions and comments are under `/var/lib/cityops-jakarta/follow-data`, outside the release directory.

HTTPS was verified with a Let's Encrypt IP-address certificate, issuer YE2. The certificate observed on 16 November 2026 expires at **2026-11-22T20:26:25Z**. Caddy is configured to manage automatic renewal using the short-lived ACME profile. This records the observed certificate and configuration; a future renewal has not yet been observed.

Seven authenticated deployment checks passed: presenter identity, manager pages (107 exported script entries), start phone-follow session, publish per-step state, retrieve the selected state from the public phone endpoint, reject a foreign-origin write, and end the temporary session. Public-page WebGL review also passed. The existing co-hosted DIVA site was checked and remained unchanged.

Local migration validation: strict TypeScript, 410 tests and the production build passed. Browser checks used software WebGL; they do not establish event-laptop frame rates or room-wide Wi-Fi capacity. No external Oracle notebook/database exercise was executed as part of these checks.

## Files and access

`cityops.caddy.template` is a sanitized example of the Jakarta site block. It deliberately contains the literal `@PASSWORD_HASH@` placeholder. Replace the placeholder only in the server's private configuration; never commit the resulting password hash. The public site is readable by attendees. The script-manager UI and administrative relay endpoints require presenter authentication.

The deployed site block is imported from `/etc/caddy/cityops-jakarta.caddy`. The main `/etc/caddy/Caddyfile` also has the global `default_sni 168.110.192.223` option required for this IP-address endpoint. **Merge that option into the existing global block; do not replace the existing Caddyfile or add a second global block.** Preserve all other host/site definitions.

The included `cityops-jakarta-follow.service` is the deployed service definition. It runs as the dedicated `cityops` user, reads application code through the active-release link, and writes only its state directory. The source repository's local preview gateway is for loopback development and is not the production server.

## Release rollover

1. Build and verify the intended application commit; record its SHA and artifact checksum.
2. Place the complete `dist/` and `follow/` release contents in a new directory under `/srv/cityops-jakarta/releases/`. Confirm the expected files before changing the active link.
3. Preserve `/var/lib/cityops-jakarta/follow-data`; it contains presenter edits and is independent of application releases.
4. Point `/srv/cityops-jakarta/current` to the checked release and restart only `cityops-jakarta-follow`. Do not alter unrelated services.
5. If the site configuration changes, validate the complete Caddy configuration before a graceful reload. Verify the application, authenticated manager, phone flow and existing co-hosted sites.

## Rollback

For an application-only rollback, restore the `current` link to the previously verified release and restart `cityops-jakarta-follow`. Keep the state directory intact. The release verified here is `/srv/cityops-jakarta/releases/20261116-ab6510b6`.

Caddy snapshots retained during installation:

- `/etc/caddy/Caddyfile.before-cityops-20261116`
- `/etc/caddy/Caddyfile.pre-cityops-reload`

Restoring the before-CityOps snapshot removes the new IP-site routing while preserving the prior host configuration. Review the intended snapshot, **validate it before applying it**, and validate the resulting complete configuration before a graceful reload. Retain the current configuration as a separate recovery copy. Do not remove or replace existing co-hosted site files.

The deployment procedure and this repository contain no SSH private key, presenter password, actual Caddy authentication hash, or co-hosted DIVA configuration.
