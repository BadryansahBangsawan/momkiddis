# Momkiddis Code Audit Report

Tanggal: 2026-07-11

## Baseline

| Check | Result |
|---|---|
| `bun run build` | Pass |
| `bun run check-types` | Pass, but only `@momkiddis/ui` ran because other packages lack `check-types` scripts |
| `bun test` | Fail: `apps/web/tests/admin-route-regressions.test.ts` expects `Route.useLoaderData()` in admin root route |
| `bunx knip --reporter json` | Exit 1 with unused-file/dependency findings; needs config/verification before deletion |

## Critical

### 1. Public auth signup can create admin users

- File: `packages/auth/src/index.ts:16`
- File: `packages/auth/src/index.ts:24`
- File: `apps/web/src/routes/api/auth/$.ts:6`
- Risk: `emailAndPassword.enabled = true` exposes Better Auth email signup through `/api/auth/$`, and `user.additionalFields.role.defaultValue = "admin"`. If Better Auth signup endpoint is reachable, any visitor can self-register as admin and pass backend `adminProcedure` checks.
- Scenario: attacker calls signup endpoint with email/password, gets user with role `admin`, then calls admin CRUD routes.
- Fix: disable public signup, or set default role to `user`/`pending`; only `superAdminProcedure` may promote users. Keep admin creation in protected router only.

### 2. Hardcoded production/admin credentials in tracked scripts

- File: `scripts/create-superadmin.ts:13`
- File: `scripts/create-superadmin.ts:14`
- File: `scripts/create-superadmin.ts:91`
- File: `scripts/seed-local-superadmin.ts:17`
- File: `scripts/seed-local-superadmin.ts:18`
- Risk: admin email/password live in git-tracked files and script prints password. Anyone with repo access knows admin credentials.
- Scenario: repo pushed/shared, attacker logs into admin if password reused or script used against remote DB.
- Fix: read credentials from env or interactive prompt; never print password; rotate exposed password; purge git history if already pushed publicly.

### 3. Hardcoded Cloudinary API secret in tracked script

- File: `scripts/upload-videos-cloudinary.ts:10`
- File: `scripts/upload-videos-cloudinary.ts:11`
- File: `scripts/upload-videos-cloudinary.ts:12`
- Risk: Cloudinary API key/secret stored in source. Secret can sign uploads/deletes depending account permissions.
- Scenario: repo leak gives attacker Cloudinary credential material.
- Fix: move to env (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`); rotate Cloudinary secret; remove old value from history if pushed.

## High

### 4. Disabled superadmin sessions still pass `superAdminProcedure`

- File: `packages/api/src/index.ts:49`
- File: `packages/api/src/index.ts:53`
- File: `packages/api/src/index.ts:54`
- Risk: `requireAdmin` blocks `isActive === false`, but `requireSuperAdmin` only checks role. A deactivated superadmin with a live session can still access superadmin-only routes.
- Scenario: owner disables compromised superadmin account, but existing session can still update roles, menu settings, site config.
- Fix: mirror `isActive` check inside `requireSuperAdmin`; optionally invalidate sessions when toggling `isActive` false.

### 5. Unauthenticated AI chat endpoint can burn API quota

- File: `apps/web/src/routes/api/chat.ts:15`
- File: `apps/web/src/routes/api/chat.ts:27`
- File: `apps/web/src/routes/api/chat.ts:46`
- File: `apps/web/src/routes/api/chat.ts:48`
- Risk: public endpoint accepts arbitrary JSON shape and forwards `body.messages` to NVIDIA with `max_tokens: 16384`. No auth, rate limit, body size cap, message count cap, or content length cap.
- Scenario: bot sends many huge message arrays; Worker spends outbound API quota and CPU streaming responses.
- Fix: add zod schema with max messages/content, lower `max_tokens`, add rate limit/Captcha/Turnstile, add timeout/abort, reject overlarge request bodies.

### 6. Test suite currently fails

- File: `apps/web/tests/admin-route-regressions.test.ts:112`
- File: `apps/web/tests/admin-route-regressions.test.ts:117`
- File: `apps/web/src/routes/admin/route.tsx:31`
- Result: `bun test` fails because test expects `Route.useLoaderData()`, but route only calls `Route.useRouteContext()` before returning login outlet.
- Scenario: CI blocks deploy, or stale regression test hides real route-hook regression intent.
- Fix: either restore `Route.useLoaderData()` if needed by TanStack route invariants, or update test to assert actual required hook order.

## Medium

### 7. Root typecheck does not cover most workspace packages

- File: `package.json:32`
- File: `apps/web/package.json:4`
- File: `packages/api/package.json:11`
- File: `packages/auth/package.json:11`
- Evidence: `bun run check-types` output ran only `@momkiddis/ui:check-types`.
- Risk: TypeScript errors in web/api/auth/db/env/infra can pass baseline check.
- Scenario: API router change breaks typecheck, but root CI reports green.
- Fix: add `check-types: tsc --noEmit` scripts to every TS workspace package, or configure Turbo pipeline with package tasks.

### 8. Public API reference likely exposes admin schema surface

- File: `apps/web/src/routes/api/rpc/$.ts:17`
- File: `apps/web/src/routes/api/rpc/$.ts:19`
- File: `apps/web/src/routes/api/rpc/$.ts:37`
- Risk: OpenAPI reference plugin is mounted publicly under `/api/rpc/api-reference`. Auth still protects calls, but endpoint names and schemas become easy reconnaissance.
- Scenario: attacker reads admin mutation names/input shapes, then targets auth bypass or credential stuffing.
- Fix: disable API reference in production or guard it behind superadmin/env flag.

### 9. Contact form lacks spam/rate protection

- File: `packages/api/src/routers/admin/contacts.ts:77`
- File: `packages/api/src/routers/admin/contacts.ts:86`
- Risk: public `contacts.submit` inserts DB rows with no rate limit, captcha, IP throttling, or duplicate suppression.
- Scenario: bot floods D1 contact table; admin inbox becomes unusable and storage grows.
- Fix: add Turnstile or per-IP rate limit, store IP hash, reject duplicate/too-frequent submissions.

### 10. Bulk admin actions allow unbounded ID arrays

- File: `packages/api/src/routers/admin/alumni.ts:96`
- File: `packages/api/src/routers/admin/gallery.ts:75`
- File: `packages/api/src/routers/admin/testimonials.ts:97`
- Risk: `ids: z.array(z.string())` has no `.max()`, then loops sequential DB writes.
- Scenario: compromised admin or UI bug sends thousands of IDs; Worker CPU/D1 ops spike.
- Fix: add `.max(100)` or similar, use batch/transaction when supported.

### 11. Public resources category filter ignored

- File: `packages/api/src/routers/resources.ts:6`
- File: `packages/api/src/routers/resources.ts:8`
- File: `packages/api/src/routers/resources.ts:10`
- Risk: input accepts `category`, but handler ignores input and returns all published resources.
- Scenario: `/resources?category=worksheet` UI expects only worksheets, API returns templates/tips too.
- Fix: destructure input and add `and(eq(resources.isPublished, true), eq(resources.category, input.category))` when category exists.

### 12. Active promos endpoint ignores date window

- File: `packages/api/src/routers/promos.ts:5`
- File: `packages/api/src/routers/promos.ts:9`
- Risk: public `listActive` returns promos where `isActive = true` even if `validUntil` expired or `validFrom` is future.
- Scenario: expired discount still shown on public pages.
- Fix: filter by `(validFrom is null or <= now)` and `(validUntil is null or >= now)`.

## Low / Quick Wins

### 13. Promo active count excludes promos without `validUntil`

- File: `packages/api/src/routers/admin/stats.ts:37`
- Risk: `gte(promos.validUntil, new Date())` excludes rows with `validUntil = null`, even though null can mean no expiry.
- Fix: count `isActive` plus `(validUntil is null or validUntil >= now)`.

### 14. Site config update accepts arbitrary keys and unbounded value length

- File: `packages/api/src/routers/admin/site-config.ts:18`
- File: `packages/api/src/routers/admin/site-config.ts:19`
- Risk: superadmin-only endpoint allows any key string and unlimited value string; unknown keys silently update zero rows.
- Scenario: UI bug sends huge values or typo keys; operation says success but no intended config changed.
- Fix: validate keys against existing rows or known enum; add max lengths per input type; return updated count.

### 15. Static CSS via `dangerouslySetInnerHTML` is low risk but avoidable

- File: `apps/web/src/components/site-footer.tsx:228`
- Risk: current `STYLES` appears static, so XSS risk low. Pattern becomes dangerous if future dynamic values enter string.
- Fix: move CSS to stylesheet/Tailwind layer, or keep strict no-interpolation comment near `STYLES`.

## Dead code / dependency notes

`knip` flagged unused files/dependencies, but current repo lacks knip config and some findings are scripts/tests/framework entry points. Do not delete blindly.

Notable candidates to verify before removing:

- `apps/web/src/components/header.tsx`
- `apps/web/src/functions/get-user.ts`
- `apps/web/src/middleware/auth.ts`
- `apps/web/src/components/admin/admin-form-shell.tsx`
- `apps/web/src/components/admin/admin-image-preview.tsx`
- Root dependencies: `@momkiddis/env`, `dotenv`, `zod`
- `apps/web` deps/devDeps flagged: `dotenv`, `libsql`, `next-themes`, `tailwindcss`, `@testing-library/*`, `jsdom`, `web-vitals`

Action: add `knip.json` with workspaces, route/test/script entry points, then re-run and remove only verified unused code.

## Recommended fix order

1. Lock down auth signup/admin default role; rotate exposed admin password.
2. Rotate/move Cloudinary secret; remove hardcoded credentials.
3. Add `isActive` check to `requireSuperAdmin` and session invalidation on disable.
4. Add chat/contact rate limits and strict input schemas.
5. Fix failing `bun test` regression.
6. Expand workspace typecheck coverage.
7. Hide OpenAPI reference in production.
8. Fix resources/promos query correctness.
9. Configure knip and clean verified unused code.
