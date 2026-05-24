---
tags: [concept, testing, dev]
updated: 2026-05-25
---

# Testing

## Commands

| Script | What runs |
|--------|-----------|
| `npm run test` | All unit Jest projects |
| `npm run test:unit` | 10 projects: `module-auth`, `module-vocabulary`, `module-chat`, `module-lessons`, `module-flashcards`, `module-notifications`, `module-progress`, `module-mail`, `data-access-prisma`, `web` |
| `npm run test:coverage` | Unit with `--coverage` |
| `npm run test:coverage:integration` | Integration + coverage |
| `npm run test:integration` | Postgres + `AppModule` (`ts-jest`) |
| `npm run test:e2e` | Playwright (`tests/e2e/playwright.config.ts`) |
| `npm run seed:test-users` | Upsert jest-*@soenglish.test users |

## Config layout

- [`jest.config.cjs`](../../../../jest.config.cjs) — unit project list
- [`jest.config.base.cjs`](../../../../jest.config.base.cjs) + [`jest.paths.cjs`](../../../../jest.paths.cjs) — aliases, `@swc/jest`
- [`packages/backend/modules/create-module-jest-config.cjs`](../../../../packages/backend/modules/create-module-jest-config.cjs) — per-module Jest factory
- Per-module: `packages/backend/modules/module-*/jest.config.cjs`
- [`apps/web/jest.config.cjs`](../../../../apps/web/jest.config.cjs) — `next/jest`, jsdom, coverage on `lib/`, `stores/`, `components/ui/`, `features/`
- [`jest.integration.config.cjs`](../../../../jest.integration.config.cjs) — `ts-jest`, **`maxWorkers: 1`** (shared DB seed; avoids cross-suite cleanup races); see [`tests/integration/README.md`](../../../../tests/integration/README.md)
- Shared helpers: [`tests/shared/`](../../../../tests/shared/) (`createMockPrisma`, `gqlAs` via integration re-export)

## Integration DB

Copy `.env.test.example`. Apply migrations to `soenglish_test`. Run `npm run seed:test-users` before integration/E2E.

Bootstrap: [`tests/integration/bootstrap.ts`](../../../../tests/integration/bootstrap.ts) (`createIntegrationApp`, `gqlAs` in [`helpers.ts`](../../../../tests/integration/helpers.ts)). Module specs import shared code as `@tests/integration/seed`, `@tests/integration/bootstrap`, etc. (`tsconfig.base.json` paths).

**Seeded users** (`tests/integration/seed.ts`): `student`, `teacher`, `admin`, **`superAdmin`** (`jest-super-admin@soenglish.test`) — password `TestPass123!`. `superAdmin` is for integration only (e.g. `systemMailStatus`); production SUPER_ADMIN remains CLI-only.

**Vocabulary integration:** pre-upsert `Word` rows in `beforeAll` — `addStudentWordCard` calls dictionary enrichment when the lemma is missing; CI has no external dictionary API.

## E2E

- Page objects: [`tests/e2e/pages/`](../../../../tests/e2e/pages/) (`LoginPage`, `SidebarNav`, `ChatPage`, `CalendarPage`)
- `SidebarNav` targets `navigation` with `aria-label="Main navigation"` only (dashboard quick actions can share link labels).
- `LoginPage.login` waits for `POST /api/auth/login` and `/dashboard` redirect before assertions.
- **E2E dev server** (`scripts/e2e-web-server.sh`): Playwright `webServer` command — starts `npm run dev`, waits for `:3000/api` + `:4200`, verifies seeded login, then keeps dev running.
- Route specs: [`tests/e2e/specs/pages/`](../../../../tests/e2e/specs/pages/) + legacy [`specs/login.spec.ts`](../../../../tests/e2e/specs/login.spec.ts), `navigation`, `product-pages`
- Env: `PLAYWRIGHT_TEST_EMAIL`, `PLAYWRIGHT_TEST_PASSWORD`, `PLAYWRIGHT_TEACHER_EMAIL`, `PLAYWRIGHT_ADMIN_EMAIL`

## Current scale (2026-05-20)

| Layer | Approx. count |
|-------|----------------|
| Unit suites | **123** (~712 tests) |
| Integration suites | **10** (`graphql-lessons`, `graphql-vocabulary`, `graphql-quiz`, RBAC, …) |
| E2E route specs | **14** files (login/nav/product + per-route under `specs/pages/`) |

Backend: unit specs co-located under `application/`, `domain/`, `shared/` (and legacy `src/lib/` during migration). Module integration: `packages/backend/modules/module-*/tests/integration/`. App integration: `tests/integration/`. Prefer testing `application/*.service.ts` and `domain/*.logic.ts` — not monolithic module entry files.

## Coverage targets (local)

| Area | Target | Status |
|------|--------|--------|
| Backend modules `src/**` | ≥80% lines | In progress — pure utils + services covered; large `auth.ts` / `be-*` services partial |
| Web `lib/` + `stores/` | ≥80% lines | In progress — all 14 stores have at least smoke unit tests |
| App `page.tsx` | E2E smoke | Most routes have `specs/pages/*.spec.ts` |
| GraphQL ops | Happy path + RBAC deny | Core domains covered; extend `graphql-lessons` / `graphql-quiz` as needed |

Run `npm run test:coverage` locally before merge.

## CI (GitHub Actions)

| Workflow | Jobs |
|----------|------|
| **CI** (`.github/workflows/ci.yml`) | `quality` (lint + typecheck), `unit`, `integration` (Postgres 16), `build` (api + web), `ci-success` gate |
| **E2E** (`.github/workflows/e2e.yml`) | Playwright on `main`, weekly cron, manual — not on every PR |
| **CD** (`.github/workflows/cd.yml`) | GHCR images `api` / `web` on `main` + `v*` tags |

Details: `docs/reference/ci-cd.md`.

**GitHub Actions:** workflows use `checkout@v5`, `setup-node@v5`, `upload-artifact@v5` with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` (Node 24 runtime for action JS). Playwright HTML report is written to repo-root `playwright-report/` for artifact upload (`if-no-files-found: ignore` — path is gitignored).

## Explicit exclusions (unit)

Documented in [`tests/integration/README.md`](../../../../tests/integration/README.md):

- Google OAuth redirect/callback (integration/manual)
- Real Telegram bot / production SMTP
- Socket.IO `chat.gateway` (GraphQL chat + E2E)
- Full `be-flashcards.ts` service class — **pure logic** in [`quiz-generator.logic.ts`](../../../../packages/backend/modules/module-flashcards/src/lib/quiz-generator.logic.ts)
- App Router page components — E2E preferred over RTL

## Module layout

See [[concepts/backend-modules]] for layer folders and where to add new specs.

## Related

- [[concepts/backend-modules]]
- [[concepts/auth-rbac]]
- [[synthesis/tech-stack]]
