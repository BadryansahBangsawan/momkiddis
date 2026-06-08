# Bugfix Report: Admin RPC Query Options

**Date:** 2026-06-08
**Status:** Fixed

## Description of the Issue

The production admin panel could not load data from several admin tables. The
browser console showed repeated `400 Bad Request` responses from
`/api/rpc/admin/*/list` and a minified React error `#310`.

**Reproduction steps:**
1. Log in to the production admin panel.
2. Open admin list pages such as activity, gallery, alumni, testimonials,
   events, resources, contacts, or promos.
3. Observe failed RPC calls and the React hook-order error in the console.

**Impact:** Authenticated admins could enter the admin area but list data could
not be fetched reliably.

## Investigation Summary

- **Symptoms examined:** Production console errors, generated route chunks, RPC
  status codes, and admin route source.
- **Code inspected:** Admin TanStack Router route, admin list/detail routes, and
  oRPC client setup.
- **Hypotheses tested:** Missing deployment secret, database failure, auth
  failure, invalid oRPC payload shape, and React hook-order mismatch.

## Discovered Root Cause

Admin route components were passing oRPC query input directly to
`queryOptions`, for example `queryOptions({ page, perPage })`, while this
project's oRPC TanStack Query adapter expects procedure input under
`queryOptions({ input: { ... } })`.

The React `#310` error came from `apps/web/src/routes/admin/route.tsx`, where
route hooks were called only after an early return for `/admin/login`. Moving
between login and protected admin pages changed the hook order.

**Defect type:** Client integration contract mismatch and React hook-order
logic error.

**Why it occurred:** Admin pages were implemented with a different
`queryOptions` call shape than the public routes, and the admin layout route
combined login-page branching with route hooks in one component.

**Contributing factors:** Production builds minify React errors, so the hook
problem appeared as `#310` instead of the full development warning.

## Resolution for the Issue

**Changes made:**
- `apps/web/src/routes/admin/route.tsx` - Calls route hooks before the login
  outlet early return.
- `apps/web/src/routes/admin/*` - Wraps admin oRPC query inputs under the
  `input` key.
- `apps/web/tests/admin-route-regressions.test.ts` - Adds regression coverage
  for admin oRPC input shape and admin route hook order.

**Approach rationale:** The fix aligns admin routes with the existing oRPC
adapter contract used elsewhere in the app and preserves the current route
structure with minimal behavioral change.

**Alternatives considered:**
- Server-side compatibility for both payload shapes - Rejected because it would
  hide client misuse and weaken typed oRPC contracts.
- Disabling React strict checks or catching the error - Rejected because the
  hook order was genuinely invalid.

## Regression Test

**Test file:** `apps/web/tests/admin-route-regressions.test.ts`
**Test names:**
- `admin oRPC queryOptions wrap procedure input under the input key`
- `admin root route calls route hooks before returning the login outlet`

**What it verifies:** Admin route source cannot call `queryOptions` with direct
procedure keys such as `page`, `perPage`, `id`, or `status`, and the admin root
route calls TanStack route hooks before the login-page return.

**Run command:** `bun test apps/web/tests/admin-route-regressions.test.ts`

## Affected Files

| File | Change |
|------|--------|
| `apps/web/src/routes/admin/contacts/index.tsx` | Wrapped list/detail query input |
| `apps/web/src/routes/admin/promos/index.tsx` | Wrapped list query input |
| `apps/web/src/routes/admin/promos/$id.tsx` | Wrapped detail/list invalidation query input |
| `apps/web/tests/admin-route-regressions.test.ts` | Regression coverage |
| `specs/bugfixes/admin-rpc-query-options/report.md` | Investigation and verification record |

## Verification

**Automated:**
- [x] Regression test passes
- [x] Full test suite passes
- [x] Repository `bun run check-types` command passes
- [x] Production web build passes

**Manual verification:**
- Deployed Worker version `37d6fbc7-7244-420c-8e23-b42a4d3b4af9`.
- `https://momkiddis-web.badryansah99.workers.dev/` returned `200`.
- `https://momkiddis-web.badryansah99.workers.dev/admin/login` returned `200`.
- `https://momkiddis-web.badryansah99.workers.dev/admin` returned `307` when
  unauthenticated.
- Admin RPC with a valid input envelope returned `401 Unauthorized` without a
  cookie, confirming the deployed Worker reaches auth instead of rejecting the
  request as malformed input.

## Prevention

**Recommendations to avoid similar bugs:**
- Keep the regression test in place for all admin route additions.
- Use the public route `queryOptions({ input: ... })` pattern as the canonical
  oRPC TanStack Query call shape.
- Split login-only and protected admin layout components if the root admin
  route grows more conditional behavior.

## Related

- Production Worker: `momkiddis-web`
