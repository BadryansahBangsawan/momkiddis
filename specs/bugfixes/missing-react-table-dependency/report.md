# Bugfix Report: Missing React Table Dependency

**Date:** 2026-06-07
**Status:** Fixed

## Description of the Issue

The GitHub Actions deploy job failed during `bun run build` because Vite could
not resolve `@tanstack/react-table` from the admin data table component.

**Reproduction steps:**
1. Create a clean checkout without existing `node_modules` or Turbo artifacts.
2. Run `bun install --frozen-lockfile`.
3. Run `bun run build` and observe the unresolved import error.

**Impact:** Every deployment from `main` fails before database migrations and
Cloudflare deployment can run.

## Investigation Summary

The repository structure, all workspace manifests, the Bun lockfile, Turbo and
Vite configuration, GitHub Actions workflow, admin table imports, and recent Git
history were inspected.

- **Symptoms examined:** CI build failure, local Turbo cache behavior, and the
  large-chunk build warning.
- **Code inspected:** `apps/web`, all `packages/*` workspaces, root build
  configuration, `.github/workflows/deploy.yml`, and dependency manifests.
- **Hypotheses tested:** Vite externalization, workspace resolution, stale Turbo
  cache, and a missing direct runtime dependency.

## Discovered Root Cause

Admin table code imports `@tanstack/react-table`, but `apps/web/package.json`
does not declare that package and `bun.lock` contains no resolution for it.

**Defect type:** Missing runtime dependency.

**Why it occurred:** The reusable admin table and consuming routes were added
without updating the web package manifest and lockfile.

**Contributing factors:** A previous local install/build artifact allowed the
main checkout to build, while the clean CI install correctly exposed the missing
dependency.

## Resolution for the Issue

**Changes made:**
- `apps/web/package.json:27` - Added `@tanstack/react-table` as a direct runtime
  dependency of the web workspace.
- `bun.lock:39` - Locked `@tanstack/react-table` and its `@tanstack/table-core`
  dependency.
- `apps/web/tests/runtime-dependencies.test.ts:1` - Added regression coverage
  for the required manifest declaration.

**Approach rationale:** Declaring the package in the workspace that imports it
matches Bun's isolated linker model and makes clean CI installs deterministic.

**Alternatives considered:**
- Vite externalization - Rejected because the browser application needs the
  package at runtime and externalizing it would hide, not fix, the missing
  dependency.
- Increasing the chunk warning limit - Rejected because the warning is
  unrelated to the unresolved import and does not fail the build.

## Regression Test

**Test file:** `apps/web/tests/runtime-dependencies.test.ts`
**Test name:** `declares the TanStack Table runtime dependency used by admin tables`

**What it verifies:** The web workspace declares the runtime package required by
the admin data table implementation.

**Run command:** `bun test apps/web/tests/runtime-dependencies.test.ts`

## Affected Files

| File | Change |
|------|--------|
| `apps/web/package.json` | Declared `@tanstack/react-table` |
| `bun.lock` | Locked React Table and Table Core |
| `apps/web/tests/runtime-dependencies.test.ts` | Regression coverage |
| `specs/bugfixes/missing-react-table-dependency/report.md` | Investigation and verification record |

## Verification

**Automated:**
- [x] Regression test passes
- [x] Full test suite passes
- [x] Project-configured type validator passes

**Manual verification:**
- A clean worktree completed `bun install --frozen-lockfile` and
  `bun run build` successfully.
- A TypeScript-parser audit confirmed that all external imports across
  `apps/*` and `packages/*` are declared in their workspace manifests.
- Direct `tsc` validation of the entire web workspace still reports unrelated
  pre-existing type errors; the repository's configured `bun run check-types`
  command passes.

## Prevention

**Recommendations to avoid similar bugs:**
- Declare every package imported by a workspace in that workspace's manifest.
- Validate dependency manifests from a clean install, not only from local
  `node_modules` or Turbo cache.

## Related

- GitHub Actions workflow: `.github/workflows/deploy.yml`
