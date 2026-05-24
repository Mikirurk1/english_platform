# Wiki log

Append-only timeline. Prefix: `## [YYYY-MM-DD] <operation> | Title`

---

## [2026-05-25] fix | E2E — wait for API before browser tests
- **Trigger:** Playwright CI — `Login failed with status 500` on first specs (`login`, `navigation`)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** `auth.setup.ts` project depends before `chromium`; polls API + login; `LoginPage` retries 5xx in CI.

## [2026-05-25] fix | GitHub Actions Node 24 + E2E artifact upload
- **Trigger:** Playwright workflow — Node 20 action deprecation; git exit 128 on artifact upload
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** `checkout@v5`, `setup-node@v5`, `upload-artifact@v5`; `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`; HTML report at repo-root `playwright-report/`; `if-no-files-found: ignore` + `include-hidden-files` for gitignored report; E2E `cancel-in-progress: false`.

## [2026-05-25] fix | E2E — sidebar locator scope + login wait
- **Trigger:** Playwright CI — strict mode on duplicate Students links; flaky login
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** `SidebarNav` scopes to `Main navigation`; `LoginPage.login` waits for `/api/auth/login` + dashboard redirect.

## [2026-05-24] fix | CI integration tests — quiz access, RBAC, serial workers
- **Trigger:** CI #25 integration job (12 failures)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** `QuizAccessService.listForWhere` — staff see owned + assigned quizzes; student `deleteQuiz` → ownership message before staff gate; `studentQuizzes` optional `studentId`; `LessonsService.create` staff-only; integration seed adds `superAdmin`; `jest.integration.config.cjs` `maxWorkers: 1`; vocab tests pre-seed words; RBAC expects `RolesGuard` message.

## [2026-05-24] fix | CI typecheck — build email-templates before tsc
- **Trigger:** CI #25 `@be/email-templates` not found during `@app/api` typecheck
- **Pages:** `package.json`, `apps/api/package.json`, `docs/reference/ci-cd.md`
- **Notes:** Path alias targets `dist/`; `typecheck` now runs `build:email-templates` first (same as `build:api`).

## [2026-05-24] fix | CI unit tests — mail, chat-store, profile, word-definitions
- **Trigger:** CI #21 failed on main after e2a3f73
- **Pages:** `log.md`, `docs/reference/ci-cd.md` (implicit)
- **Notes:** `nodemailer` default import; chat message `conversationId`; `nativeLanguageId` in profile test; POS `undefined`; `test:unit` runs `prisma:generate`.

## [2026-05-24] fix | IDE Problems — tsconfig.ide + Prisma generate
- **Trigger:** Problems panel (decorators, @be/*, @tests/integration, node_modules noise)
- **Pages:** `tsconfig.ide.json`, `.vscode/settings.json`, `tsconfig.base.json`, `package.json` (`predev`), `tests/integration/tsconfig.json`
- **Notes:** `enableProjectDiagnostics` off; single `typescript.tsconfig` for paths/decorators; `npm run prisma:generate` in `predev` (PrismaService types).

## [2026-05-24] fix | CI npm ci — Linux lockfile + Dependabot
- **Trigger:** Dependabot PRs fail ~30s at Install dependencies
- **Pages:** `package-lock.json`, `.github/dependabot.yml`, `docs/reference/ci-cd.md`, `package.json` (`lockfile:linux`)
- **Notes:** `npm ci` on Linux needed `@emnapi/*` in lockfile; regen via `npm run lockfile:linux`. Removed dev-dependency **group** to avoid bundled eslint/peer breaks.

## [2026-05-24] update | Docker dev — postgres only by default
- **Trigger:** user prefers host `npm run dev` (visible terminal logs), not api/web in Docker
- **Pages:** `infra/docker/README.md`, `docker-compose.yml` (profile `stack`), `package.json`, `scripts/docker-restore-all.sh`, `synthesis/tech-stack.md`
- **Notes:** `docker:up` = Postgres only; `docker:stack` / `docker:restore:stack` = optional full containers; `docker:stack:down` stops api/web.

## [2026-05-24] note | auth/me 500 when Postgres down
- **Trigger:** debug (recurring `GET /api/auth/me` 500)
- **Pages:** `synthesis/tech-stack.md`, `package.json` (`docker:postgres`)
- **Notes:** Prisma `ECONNREFUSED` on refresh-token lookup → Nest 500. Start `soenglish-postgres` before `npm run dev`.

## [2026-05-24] note | Prisma Studio ERR_STREAM_UNABLE_TO_PIPE
- **Trigger:** debug (terminal log while `npx prisma studio`)
- **Pages:** `synthesis/tech-stack.md`, `package.json` (`prisma:studio`)
- **Notes:** Harmless log noise on Prisma 7 + Node 22+; open the printed localhost URL. **"Could not load schema metadata"** is different — Postgres was down on `:5432`; start `soenglish-postgres` and restart Studio.

## [2026-05-24] update | PlatformSettings upsert P2002 race
- **Trigger:** debug (`platformSettings.upsert` unique on `id`)
- **Pages:** `log.md`
- **Notes:** `PlatformSettingsService.ensureSettingsRow` uses findUnique + create + P2002 retry instead of upsert; `setWordDictionaryProvider` uses update after ensure (concurrent first requests on singleton `id=default`).

## [2026-05-24] note | Fresh DB — SUPER_ADMIN CLI
- **Trigger:** user deleted database
- **Pages:** `concepts/auth-rbac.md` (existing CLI docs)
- **Notes:** After `prisma:migrate:deploy` + `prisma:seed:languages`, create via `npm run super-admin -- token` then `create --email … --password …` (requires `SUPER_ADMIN_CLI_SECRET` in `.env`).

## [2026-05-24] update | Web IDE @pkg/types resolution
- **Trigger:** Problems panel (`moduleResolution`, Map iterator, TIME_ZONE unknown)
- **Pages:** `log.md`
- **Notes:** Removed root `tsconfig.json` + `typescript.tsconfig` in VS Code (forced `node` resolution). `@pkg/types` package exports `types` field; `apps/web` `target` ES2022 + `downlevelIteration`; `scheduledLessonsBackendAdapter` uses `Array.from` + typed `TIME_ZONE` keys.

## [2026-05-24] update | Docker dev stack restore
- **Trigger:** user request (deleted containers)
- **Pages:** `log.md`, `infra/docker/README.md`
- **Notes:** Dev stack = `soenglish-postgres`, `soenglish-api`, `soenglish-web` via `infra/docker/docker-compose.yml`. Compose: `env_file` `.env`, `NODE_OPTIONS` 4GB for api/web (avoids tsc OOM in container), `npm run docker:up|down|logs|ps`, `npm run docker:restore` (`scripts/docker-restore-all.sh` scans `~/Programming` for other compose files). Other deleted containers are **not** defined in this repo — recover via remaining volumes/images or project compose paths.

## [2026-05-24] update | Integration tests IDE paths
- **Trigger:** user request (Problems on `tests/integration/bootstrap.ts`)
- **Pages:** `concepts/testing.md` (via README), `log.md`
- **Notes:** `@tests/integration/*` in `tsconfig.base.json`; `tests/integration/tsconfig.json` includes module `tests/integration/**/*.ts`; root `tsconfig.json` solution references; fixed broken `../../../../../` imports in module integration specs.

## [2026-05-24] update | IDE Problems — package tsconfig.lib
- **Trigger:** user request (fix Problems panel)
- **Pages:** `log.md`
- **Notes:** All `tsconfig.lib.json` exclude `*.spec.ts` / `tests/`; strict fixes (`noPropertyAccessFromIndexSignature`, Prisma update types, nodemailer import, `@types/multer`, `@be/graphql` tsconfig); feature-vocabulary fetch without Next-only `next` option.

## [2026-05-24] update | Dependabot vs CI setup-monorepo
- **Trigger:** debug (Dependabot PRs fail ~30s)
- **Pages:** `log.md`, `docs/reference/ci-cd.md`
- **Notes:** `npm ci` in composite action fails when lockfile lacks Linux `@emnapi/*` optional deps, or when grouped dev PR bumps `eslint@10` (peer conflict with `eslint-plugin-import`). `.github/dependabot.yml` — dev group **minor/patch** only; ignore majors for eslint/typescript/jest. Close stale Dependabot PRs after lockfile fix on `main`.

## [2026-05-24] update | CI/CD pipelines (GitHub Actions)
- **Trigger:** user request
- **Pages:** `concepts/testing.md`, `synthesis/tech-stack.md`, `log.md`
- **Notes:** Parallel CI (quality, unit, integration, build); E2E workflow; CD → GHCR with `api.prod` / `web.prod` Dockerfiles; Next `output: standalone`; `docs/reference/ci-cd.md`, `.dockerignore`, dependabot.

## [2026-05-24] update | Web unit test fixtures + tsconfig.spec
- **Trigger:** code change
- **Pages:** `log.md`
- **Notes:** `apps/web/src/testing/fixtures.ts` typed mocks; `tsconfig.spec.json` includes jest-dom types + `index.d.ts` SCSS modules; `LessonPartyOption` imported from `use-lesson-party-options` (not `@pkg/types`).

## [2026-05-24] update | Problems panel / typecheck + lint green
- **Trigger:** code change (fix IDE Problems)
- **Pages:** `overview.md`, `log.md`
- **Notes:** Calendar null-narrowing in portaled dialogs; `LessonModal` teachers typed as `LessonPartyOption[]`; web production TS fixes; unused imports; ESLint globals for `.cjs` / `next.config.mjs`; `@app/web` tsconfig excludes unit test files from `tsc`.

## [2026-05-24] update | VS Code / Cursor workspace diagnostics
- **Trigger:** user request
- **Pages:** `overview.md`, `log.md`
- **Notes:** `.vscode/settings.json` (`enableProjectDiagnostics`, ESLint `workingDirectories: auto`), `extensions.json`, `tasks.json` for `npm run typecheck` / `lint` / `test:unit`.

## [2026-05-24] update | Backend hygiene follow-ups
- **Trigger:** code change (post-refactor cleanup plan)
- **Pages:** `concepts/auth-rbac.md`, `concepts/backend-modules.md`, `overview.md`, `synthesis/tech-stack.md`, `entities/user.md`, `log.md`
- **Notes:** Layered `module-mail` / `module-notifications`; Prisma out of admin/users/system GraphQL resolvers; `QuizGeneratorService` split (list/detail/generate/attempt + repository); `@Roles`/`RolesGuard`; narrowed `@be/auth` exports; Prisma CLI paths → `data-access-prisma`; module `tests/integration/`; ESLint max-lines + layer imports; GitHub Actions CI.

## [2026-05-24] update | Backend module architecture refactor
- **Trigger:** code change (big-bang modular layout)
- **Pages:** `concepts/backend-modules.md`, `synthesis/architecture.md`, `concepts/testing.md`, `index.md`
- **Notes:** Layered `presentation/application/domain/infrastructure` per `@be/*`; GraphQL resolvers in modules; `@be/graphql` shared types; thin `apps/api` gateway.

## [2026-05-20] update | Turbo dev TUI + app-only filter
- **Trigger:** user request (restore 2-pane terminal UI on `npm run dev`)
- **Pages:** `overview.md`, `log.md`
- **Notes:** `turbo.json` `"ui": "tui"`; root `dev` script filters `@app/web` + `@app/api` (drops 9 workspace packages without `dev` script from scope).

## [2026-05-20] update | lesson-recurrence, users, attachments, mail index, be-prisma
- **Trigger:** user request (coverage gaps)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 123 unit suites / 712 tests — `lesson-recurrence` (daily/weekly/monthly horizons), `users.service` (profile/password/pagination), `lesson-attachment.service` (disk CRUD + create rollback), `module-mail/index.spec.ts`, `be-prisma` default `DATABASE_URL`.

## [2026-05-20] update | Web lib/stores + be-prisma unit coverage
- **Trigger:** user request (coverage gaps: fileUtils, chat-upload, tracker, roles, student-profile, vocabulary-audio, word-definitions, word-details-payload, mocks, auth-store, be-prisma)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 122 unit suites / 688 tests — new `data-access-prisma` Jest project + `be-prisma.spec.ts`; expanded web tests listed above.

## [2026-05-20] update | Targeted coverage: quizzes-store, auth, practice, chat mail
- **Trigger:** user request (coverage gaps from report)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 121 unit suites / 646 tests — expanded `quizzes-store`, `auth-cookies`, `auth.guard` (AuthGuard/OptionalAuthGuard), `delete-admin-user`, `practice-sessions.service`, `students-admin.service`, `chat-attachment.service`, new `mail.module.spec.ts`.

## [2026-05-20] fix | be-vocabulary resolveVerbForms import + dispatch/lesson tests
- **Trigger:** user request (continue) + dev build failure
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** Fixed `resolveVerbForms` import in `be-vocabulary.ts` (API `tsc` green). 603 unit tests — `notification-dispatch` partial channel send, `series-lesson-delete` edge cases, `lessonPersistence` editing/create content.

## [2026-05-20] update | Practice/notifications stores + series-lesson + translation
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 120 unit suites / 597 tests — `practice-store`, `notifications-store` (MAX_TOASTS/auto-dismiss), `series-lesson-update` (conflicts/schedule persist), `TranslationService` edge cases.

## [2026-05-20] update | Students/vocabulary/admin stores + telegram + recurring lessons
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 120 unit suites / 582 tests — `students-store`, `vocabulary-store` (CRUD/pagination), `admin-store`, `languages-store`, `recurring-lesson-create` conflict/past paths, `telegram-bot.client` network/API edge cases.

## [2026-05-20] update | Profile/chat stores + ChatService + Google Calendar
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 120 unit suites / 544 tests — `profile-store` (update/password/auth sync), `chat-store` (messages/pagination/append/markRead), `ChatService` (send/attachments/group), `GoogleCalendarService` (googleapis mock for Meet CRUD).

## [2026-05-20] update | Button/Field UI kit + lessons/quizzes stores
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 120 unit suites / 510 tests — `Button.test.tsx` (loading, async pending, icons), `Field.test.tsx` (select/checkbox/tel/readOnly/file-button), expanded `lessons-store` + `quizzes-store`. Web UI coverage: Button ~97% lines, Field ~96% lines.

## [2026-05-20] update | Daily goals, chat attachments, dashboard/confirm stores
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 120 unit suites / 475 tests — `DailyGoalsService`, `ChatAttachmentService`, `dashboard-store`, `confirm-dialog-store`, `vocabulary-ui`, `lessonPersistence` content omit.

## [2026-05-20] update | Mail SMTP + NotificationsMail + lessonTime
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 120 unit suites / 456 tests — `MailService` nodemailer mock, `NotificationsMailService`, `sendTelegramBotMessage`, `lessonTime` helpers, `profile-form`, `quiz-questions`.

## [2026-05-20] update | Translation/Telegram fetch mocks + web upload/previews
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 119 unit suites / 442 tests — `TranslationService` Libre+GTX, `telegram-bot.client` widget/getUpdates, `word-details-payload`, `chat-upload`, `lesson-file-links`, `chatUnreadTotal`, `escapeRegex`.

## [2026-05-20] update | Dashboard hero, header search, ESLint for Jest CJS
- **Trigger:** user request (continue coverage) + ESLint on `jest.config.cjs`
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 119 unit suites / 427 tests — `dashboard-hero` homework/calendar/streak, `header-search` lessons/vocab, `hydrateLessonPartyNames`, `chat-attachment.util` reject/sanitize; root ESLint Node globals for `*.config.cjs`.

## [2026-05-20] update | Lesson persistence, conflicts, calendar service
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 119 unit suites / 415 tests — expanded `lessonPersistence`, `conflicts`, `fileUtils.filterSafeFiles`, `lesson-series` content/time helpers; new `lessonCalendarService.test`.

## [2026-05-20] update | API/chat-socket, lesson series, dictionary merge, integration cleanup
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 118 unit suites / 399 tests — `api`, `chat-socket`, lesson-modal sync/recurring/series-update, `dictionary-merge.util`; `cleanupTestUsers` clears chat/lessons/quiz FKs.

## [2026-05-20] update | Web lib stats/profile/audio + dashboard wordOfDay
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 111 unit suites / 378 tests — `live-statistics-dashboard`, `student-profile`, `student-lessons`, `student-schedule-type`, `vocabulary-audio`, `lesson-attachment-upload`; `DashboardService.wordOfDayFor` stability spec.

## [2026-05-20] update | Web features + staff access + facebook oauth tests
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 105 unit suites / 360 tests — `vocabulary-staff-access.util`, `facebook-oauth`, web `lessonPersistence`/`lessonCalendarAdapter`/`dragPayload`/`series-lesson-delete`/`active-user-role`; integration quiz delete RBAC + student quiz detail.

## [2026-05-20] update | RBAC utils, E2E page objects, chat integration
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** `lessons-access.util`, `vocabulary-rbac.util`; E2E `ChatPage`/`CalendarPage`; integration chat direct conversation + invalid inbox cursor; dropped service specs importing full `be-*` (SWC SIGABRT).

## [2026-05-20] update | vocabulary/lessons map utils + integration RBAC
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** Extracted `vocabulary-map.util.ts` and `lessons-map.util.ts` from `be-vocabulary` / `be-lessons` with unit specs; integration tests for teacher vocab add, invalid cursor, student/admin lessons.

## [2026-05-20] update | Unit tests batch 5 (lesson adapter, lessonTime, practice tracker)
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 93 unit suites / 320 tests — `scheduledLessonsBackendAdapter`, `lessonTime` wall-clock helpers, `practice-session-tracker`, `paginated-api` loadInitial/loadNext, `students-admin` teacher restrictions, `chat.service` inboxPage.

## [2026-05-20] update | Unit tests batch 4 (chat service, live stats, file links)
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 90 unit suites / 301 tests — extracted `chat-inbox-cursor.util`; `chat.service`, `chat-attachment`, `telegram-delivery` specs; web student/profile live stats, lesson file links, teacher chat peer resolver.

## [2026-05-20] update | Unit tests batch 3 (translation, dashboard, vocabulary UI)
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 82 unit suites / 271 tests — `translation.service`, `platform-settings`, `lesson-attachment`, `notification-delivery`, expanded `google-calendar`; web `dashboard-hero`, `vocabulary-ui`, `word-details-payload`, `lesson-pending-files`, `pkg-shared-types`, lesson party / schedule helpers.

## [2026-05-20] update | Unit tests batch 2 (streak, dispatch, web lib)
- **Trigger:** user request (continue coverage)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 72 unit suites / 231 tests — `streak.service`, `notification-dispatch`, `daily-goals` + `irregular-verbs` (@pkg/types), web `word-definitions` / `practice-pending` / `avatar` / `lesson-file-ref`; store `createIdleSlice()` fix; expanded `chat-visibility`, `users.service.listAssignableTeachers`, `streak-alert.job`.

## [2026-05-20] update | Technical package import aliases
- **Trigger:** user request
- **Pages:** `concepts/package-aliases.md` (new), `synthesis/tech-stack.md`, `concepts/frontend-packages.md`, `index.md`, `log.md`
- **Notes:** Renamed npm scopes from `@soenglish/*` to `@pkg/types`, `@be/*`, `@fe/*`, `@app/*`; updated tsconfig, jest.paths, eslint boundaries, all package.json names, Docker CMD filters.

## [2026-05-20] update | Test coverage continuation
- **Trigger:** user request
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** Expanded dictionary-payload, quiz cursor in `quiz-generator.logic`, notification-prefs, practice weekSummary, users pagination; web lib (profile-form, lesson-series, header-search, chat-upload, quiz-questions); integration lessons + quiz suites; 56 unit / 170 tests.

## [2026-05-20] update | Full test coverage plan (infra + breadth)
- **Trigger:** code change (user plan)
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** 9 Jest unit projects via `create-module-jest-config.cjs`; `test:coverage` scripts; `tests/shared/`; ~48 unit / 8 integration / 14 E2E route specs; `quiz-generator.logic.ts` extract; all web Zustand stores smoke-tested; GraphQL integration split by domain.

## [2026-05-20] update | Phase 3 core product tests
- **Trigger:** code change
- **Pages:** `concepts/testing.md`, `concepts/lessons-calendar.md` (createMeetLink GraphQL), `log.md`
- **Notes:** backend-modules Jest project; vocabulary/chat unit; web recurrence/paginated-api/Field; graphql-product integration; E2E product-pages smoke; 60 unit / 10 integration.

## [2026-05-20] update | Phase 2 auth/RBAC tests
- **Trigger:** code change
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** seed.ts, auth-session + telegram unit, refresh/logout integration, graphql-rbac (3), auth-store + roles web tests; 40 unit / 7 integration.

## [2026-05-20] update | Testing coverage roadmap (phases 2–5)
- **Trigger:** user request
- **Pages:** `concepts/testing.md`, `log.md`
- **Notes:** Phased plan to ~40% critical paths (auth → lessons/vocab/flashcards/chat → CI coverage gates).

## [2026-05-20] update | Jest unit, integration, Playwright E2E
- **Trigger:** code change
- **Pages:** `concepts/testing.md`, `synthesis/tech-stack.md`, `log.md`, `index.md`
- **Notes:** Jest projects `module-auth` + `web` (`@swc/jest`, `next/jest`); integration via `jest.integration.config.cjs` + `ts-jest` + supertest; Playwright in `tests/e2e/`. Scripts: `test`, `test:unit`, `test:integration`, `test:e2e`.

## [2026-05-18] update | Prisma migrations squashed to baseline
- **Trigger:** debug (`migrate dev` P3006 shadow DB / missing `User` table)
- **Pages:** `synthesis/tech-stack.md`, `log.md`
- **Notes:** Replaced six incremental-only migrations with `20260501000000_baseline`. Existing DBs: `npm run prisma:migrate:rebaseline` once if history still lists old names.

## [2026-05-18] update | User display color (calendar + staff edit)
- **Trigger:** code change
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Prisma `User.displayColor`; random on `createUserAsAdmin`; staff edit on student profile; calendar reads API colors. Renamed UI from "Calendar color (HEX)" to **User color**.

## [2026-05-18] update | Appearance font size scales full UI
- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** `html[data-font-size]` root 14/16/18px; `--fs-9`…`--fs-52` rem tokens; module SCSS `font-size: Npx` → `var(--fs-N)`.

## [2026-05-18] update | Profile: no self-delete; admin delete confirm
- **Trigger:** code change
- **Pages:** `concepts/auth-rbac.md`, `log.md`
- **Notes:** Removed **Delete account** from Profile → Account. Admin user delete uses `confirmDialog` (“Are you sure…”) before `deleteUser`.

## [2026-05-18] update | Profile change password; remove data export stub
- **Trigger:** code change
- **Pages:** `concepts/auth-rbac.md`, `log.md`
- **Notes:** Account tab: `changeMyPassword` modal via `profile-store`; OAuth-only users see hint (`hasPassword` false). Removed **Export my data** row (no backend).

## [2026-05-18] update | Icon-only Button padding + fixed hit targets
- **Trigger:** UI polish
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** `Button` sets `data-icon-only` when children are Lucide-only (no text). Fixed SCSS for `deleteIconBtn`, chat `iconBtn`, toast close, quiz modal close, admin/vocab delete icon buttons.

## [2026-05-18] update | Student response images after lesson save
- **Trigger:** bug fix
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** After save, previews use API `fileLinks` (`resolveLessonFilePreview`); student response chips match homework/materials pattern; lesson page rebuilds response previews on save.

## [2026-05-18] update | Homework save in lesson series + file previews
- **Trigger:** bug fix
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Series modal save now applies homework/materials/plan only to the edited lesson; homework chips use `fileLinks`; lesson page preview state no longer resets on unrelated store updates.

## [2026-05-18] update | Lesson material images persist after save
- **Trigger:** bug fix
- **Pages:** `entities/lesson-material.md`, `log.md`
- **Notes:** `mergeLessonDisplayNames` no longer overwrites API materials/fileLinks; modal flushes material draft on lesson save; previews sync from `fileLinks`.

## [2026-05-18] update | Calendar Request lesson → teacher chat
- **Trigger:** code change
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Student **Request lesson** navigates to `/chat?peer=` assigned teacher.

## [2026-05-18] update | Student lesson vocabulary on lesson page
- **Trigger:** code change
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Students see Lesson vocabulary block and add words; `studentBackendId` from auth on lesson page; re-link existing cards to lesson when `lessonId` set.

## [2026-05-18] update | Lesson party names + file attachments API

- **Trigger:** code change
- **Pages:** `concepts/lessons-calendar.md`, `entities/lesson-material.md`, `log.md`
- **Notes:** GraphQL `teacherName`/`studentName`; `LessonFileAttachment` + REST upload/download; web uploads pending files on persist; fixed `activeUser.fullName` on lesson page.

## [2026-05-18] update | Lesson hub: summary, party names, material files

- **Trigger:** code change
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Hide empty short summary for students; student/teacher labels via `resolveLessonPartyLabel`; lesson attachments open/download via blob URLs (`openLessonAttachment`).

## [2026-05-18] update | PageHeader back before title

- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** `PageHeader` `back` prop; quiz + vocabulary use it instead of placing Back in `actions`.

## [2026-05-18] update | AdaptiveSelect removed; Field select only

- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`, `.cursor/rules/web-component-reuse.mdc`
- **Notes:** All call sites use `<Field as="select" />`; `AdaptiveSelect.tsx` deleted.

## [2026-05-18] update | Adaptive select merged into Field

- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`, `.cursor/rules/web-component-reuse.mdc`
- **Notes:** `Field as="select"` uses former `AdaptiveSelect` logic in `Field.tsx`.

## [2026-05-18] update | apps/web raw HTML → UI primitives audit

- **Trigger:** user request
- **Pages:** `concepts/ui-design-system.md`, `log.md`, `.cursor/rules/web-component-reuse.mdc`
- **Notes:** Replaced raw `<button>`/`<input>`/`<img>` across app/features with `Button`, `Field`, `Image`, `SegmentedControl`; chat attachments use `next/image`; external links unchanged.

## [2026-05-18] update | Cursor rule — web component reuse

- **Trigger:** user request
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** `.cursor/rules/web-component-reuse.mdc` — Link, Image, Field, Button instead of raw HTML in `apps/web`.

## [2026-05-18] fix | generateQuiz REST + GraphQL includeIrregularVerbDrills

- **Trigger:** debug
- **Pages:** `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** `GenerateQuizInput.includeIrregularVerbDrills` in `graphql.types.ts`; web store calls `POST /quizzes/generate` so generation works before GraphQL schema reload.

## [2026-05-18] update | Quiz generation + irregular verbs

- **Trigger:** code change | user request
- **Pages:** `concepts/quizzes-flashcards.md`, `concepts/vocabulary.md`, `log.md`
- **Notes:** Curated `irregular-verbs.ts` + `verbForms` on `WordCardDto`; flashcard/list `VerbFormsLine`; fixed `mixed` pool (lesson + rest); quiz templates for past / past participle, translation MCQ, weighted `mistakes_work`; `CreateQuizCard` source hints + `includeIrregularVerbDrills`.

## [2026-05-18] update | Quiz create card (merged auto-generate panel)

- **Trigger:** user request
- **Pages:** `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** Removed standalone `GenerateQuizPanel` on `/quiz` and student Quiz tab; generation (source, difficulty, count) lives in `CreateQuizCard` inside `manageGrid`.

## [2026-05-18] update | Vocabulary Play setup card UI

- **Trigger:** user request
- **Pages:** `concepts/vocabulary.md`, `log.md`
- **Notes:** Play mode setup merged into one card with hero, source filters, bottom Play button.

## [2026-05-18] update | Vocabulary POS filter scopes card glosses

- **Trigger:** user request
- **Pages:** `concepts/vocabulary.md`, `log.md`
- **Notes:** `pickWordDefinition` / `pickWordTranslation` accept POS filter; `resolveVocabularyGlossesForPosFilter` updates list + flashcard translation/definition when a part-of-speech chip is selected.

## [2026-05-18] update | Vocabulary flashcards filters, POS, card size

- **Trigger:** user request
- **Pages:** `concepts/vocabulary.md`, `log.md`
- **Notes:** `VocabularyFiltersBar` on list + flashcards (lesson + POS); `collectWordPartsOfSpeech` / `wordMatchesPosFilter`; taller flashcard + glosses/synonyms/lesson on card.

## [2026-05-18] update | Vocabulary flashcards (audio, student actions)

- **Trigger:** user request
- **Pages:** `concepts/vocabulary.md`, `log.md`
- **Notes:** Flashcard front: pronunciation + origin; back: translation when distinct; `statusActions` by role (student: Still learning / Got it; staff: full set including Repeated). No staff-only **Start over** for students.

## [2026-05-18] update | Lesson timezones (viewer calendar + cross-party display)

- **Trigger:** user request
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `useViewerTimezone`; calendar/dashboard in profile TZ; `LessonPartyScheduleTimes` on modal + lesson page; `assignableTeachers.timezone` in GraphQL.

## [2026-05-18] fix | Lessons list empty after pagination

- **Trigger:** bug report (empty SurfaceCard on `/lessons`)
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `listForPage` now orders **desc** (newest first); `/lessons` default filter **All** + fallback to provider full list when page slice empty.

## [2026-05-18] update | Lessons list infinite scroll

- **Trigger:** user question
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `scheduledLessonsPage` GraphQL + `LessonsService.listForPage`; `/lessons` uses paginated store; calendar still loads full `scheduledLessons`.

## [2026-05-18] update | Chat scroll-up pagination (web)

- **Trigger:** plan implementation
- **Pages:** `concepts/chat.md`, `log.md`
- **Notes:** `chat-store` `fetchOlderMessages`, `hasMoreOlder`, `loadingOlder`; `ChatThread` IntersectionObserver + scroll preservation.

## [2026-05-18] update | Student-page quiz uses student vocab only

- **Trigger:** user note
- **Pages:** `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** `resolveQuizTargetStudentId`; staff `listFor` excludes quizzes assigned only to other students; store skips `fetchList` when `studentId` set on generate/delete/submit.

## [2026-05-18] update | Practice badge excludes completed quizzes (staff)

- **Trigger:** bug
- **Pages:** `log.md`
- **Notes:** `countIncompleteQuizzesFromList` filters `!attempt.finishedAt` like student assignments; Practice statPill + sidebar badge.

## [2026-05-18] update | GraphQL QuizAttemptSummaryType init order

- **Trigger:** debug (API crash on dev)
- **Pages:** `log.md`
- **Notes:** `QuizAttemptSummaryType` declared before `QuizCardType` to fix TDZ `ReferenceError`.

## [2026-05-18] update | Admin self-quiz attempt on cards

- **Trigger:** bug (admin own quiz not marked complete)
- **Pages:** `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** `quizzes` query returns `attempt`; staff Start (not Practice) + `studentId` on submit; `QuizAssignmentCards` on manage grid.

## [2026-05-18] update | Quiz vocab source + student tab cards

- **Trigger:** user note (admin vocabulary-only quizzes; student page card results)
- **Pages:** `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** `collectPool` / distractors from user cards only; `QuizAssignmentCards` on student profile Quiz tab and `/quiz` student grid.

## [2026-05-18] update | Quiz completion reflected on student cards

- **Trigger:** bug (result not on card after submit)
- **Pages:** `log.md`
- **Notes:** `submitQuizAttempt` refetches + optimistic `attempt`; `listForStudent` loads latest `QuizAttempt` per quiz; quiz page returns to intro with score banner.

## [2026-05-18] update | Chat attachment URL without double /api

- **Trigger:** bug (404 on `/api/api/chat/attachments/...`)
- **Pages:** `concepts/chat.md`, `log.md`
- **Notes:** `attachmentUrl` returns `/chat/attachments/:id`; web prepends `API_BASE` once.

## [2026-05-18] update | Vocabulary statistics timestamps in GraphQL

- **Trigger:** bug (vocabulary added vs known chart empty)
- **Pages:** `entities/student-word-card.md`, `concepts/web-app.md`, `log.md`
- **Notes:** `STUDENT_VOCABULARY` and card mutations now fetch `firstSeenAt`/`knownAt`; `vocabularyTrendFromCards` buckets by UTC date key (up to 14 days in range).

## [2026-05-18] update | Delete series: planned lessons only

- **Trigger:** code change (user note)
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `getPlannedLessonsInSeries`; confirm copy; skip when none planned.

## [2026-05-18] update | Telegram dev polling opt-in only

- **Trigger:** user note (409 spam)
- **Pages:** `concepts/auth-rbac.md`, `log.md`
- **Notes:** `shouldTelegramDevPolling` requires `TELEGRAM_DEV_POLLING=true`; no auto-enable on localhost.

## [2026-05-18] update | Telegram dev polling 409 log dedupe

- **Trigger:** debug / user note
- **Pages:** `log.md`
- **Notes:** 409 = duplicate getUpdates; one-time warn + 60s backoff.

## [2026-05-18] update | Button async loading + confirm onConfirm

- **Trigger:** code change (UX)
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** `Button` auto-pending for Promise onClick; `loadingLabel`; `confirmDialog.onConfirm` with spinner on confirm.

## [2026-05-18] update | Confirm/toast BodyPortal above lesson modal

- **Trigger:** bug (confirms under Edit lesson)
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `BodyPortal` + `WhenPortaled`; confirms/toasts on `document.body` at z 2400/10100.

## [2026-05-18] update | Series unlink fix, delete series, z-index stack

- **Trigger:** code change (bug + UX)
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Unlink sends `seriesId: null`; delete-all-series button; confirms above lesson modal; toasts on top.

## [2026-05-18] update | Series UX: unlink default, calendar dialogs, scheduleType gate

- **Trigger:** code change (plan)
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Removed apply-to-series checkbox; drag detach vs resize apply-all popups; series icon; `User.scheduleType` + Recurrence gate.

## [2026-05-18] update | Lesson series: apply time to all + conflict check + unlink persist

- **Trigger:** user note
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `applyToSeries` UI; series schedule validation; batch persist; unlink saves to API.

## [2026-05-18] update | Lesson recurrence expands future occurrences on create

- **Trigger:** code change (bug)
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `expandRecurrenceDates` materializes daily/weekly/monthly lessons ahead; shared create path in calendar + lesson modal.

## [2026-05-18] update | Header search + student hero UX

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** Working `HeaderSearch`; student hero drops Cards stat; chat button inline with name; vocabulary `?q=` deep link.

## [2026-05-18] update | Statistics charts restored with live API data

- **Trigger:** user note
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** `StatisticsDashboard` accepts `liveLessons`/`liveCards`; `buildLiveStatisticsDashboard` replaces mock-only `ProfileLiveStatistics` on profile and student tabs.

## [2026-05-18] update | Student page: native language, stats, chat, lessons, vocab add

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** Student profile native language field; live stats (student + profile Statistics tab); hero chat link `/chat?peer=`; lessons from GraphQL; vocabulary add bar on student tab.

## [2026-05-18] update | BrandLogo back to SVG (no PNG)

- **Trigger:** user note + code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** Restored inline SVG + text logo; removed PNG wordmarks from `public/brand/`.

## [2026-05-18] update | Restore missing BrandLogo module

- **Trigger:** debug (build error)
- **Pages:** `log.md`
- **Notes:** `components/brand/BrandLogo.tsx` and `public/brand/soenglish-logo*.png` were referenced but absent on disk; recreated component and restored PNGs.

## [2026-05-18] update | Brand logo (favicon, header, login)

- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** `BrandLogo` + PNGs under `public/brand/`; `app/icon.png` / `apple-icon.png`; header swaps full vs mark by breakpoint/collapsed sidebar.

## [2026-05-18] update | Dashboard density (quick actions, teacher panels)

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** Quick actions row; week lessons list; teacher right column (homework, students, month glance); role-specific stat tiles.

## [2026-05-18] update | Lesson content on create + lesson page

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** Create/update persist `materials`/`homework`/`lessonPlan`; GraphQL create passes content; modal form syncs to lessons store (`syncLessonFormChange`).

## [2026-05-18] update | Profile Account tab Log out

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** `AccountPanel` — Session row with `useAuth().logout()` + redirect `/login` when session exists.

## [2026-05-18] update | Profile tabs + calendar teacher filter (mobile)

- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `log.md`
- **Notes:** Calendar `teacherFilter` compact on sm/md; `ProfileViewShell` tabs horizontal scroll + `tabPanel` overflow; profile form grids/linked rows stack on mobile.

## [2026-05-18] update | Calendar page responsive

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** `/calendar` — `calLayout` 1 col on md/sm; header controls stack; month cells dots-only on mobile; week grid min-width + horizontal scroll; sidebar/event cards touch-friendly.

## [2026-05-18] update | Responsive UI (mobile + tablet)

- **Trigger:** code change
- **Pages:** `concepts/ui-design-system.md`, `concepts/web-app.md`, `log.md`
- **Notes:** `useBreakpoint`, `ShellNavProvider`/`MobileNavDrawer`, `sidebar-nav.tsx`; shell + route SCSS (`respond-to`); chat master-detail on mobile; dashboard grids stack.

## [2026-05-18] update | Coursework expanded (~50 pp)

- **Trigger:** user request
- **Pages:** `log.md`
- **Notes:** `coursework-expanded.mjs` — tech stack prose, React/Next hooks tables, §3.6–3.8, GraphQL/routes tables; DOCX regen.

## [2026-05-18] update | Coursework Word template (SoEnglish)

- **Trigger:** user request
- **Pages:** `log.md`
- **Notes:** `docs/coursework/Курсова_SoEnglish.docx`, generator scripts, FR/NFR tables, figure placeholders 1–21.

## [2026-05-16] update | Dashboard live data

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `concepts/graphql-api.md`, `log.md`
- **Notes:** `learningStreak` + `wordOfDay` GraphQL; `StreakService` exported from notifications; hero/lessons/vocab/streak/WOD wired on `/dashboard`; role-aware layout.

## [2026-05-19] update | Daily goals (backend + dashboard)

- **Trigger:** code change
- **Pages:** `concepts/daily-goals.md`, `index.md`, `log.md`
- **Notes:** `DailyGoalCompletion` Prisma model; `dailyGoals` / `setDailyGoalDone` GraphQL; shared `daily-goals.ts`; interactive `DailyGoalsCard` for students.

## [2026-05-18] update | Chat attachments + emoji

- **Trigger:** code change
- **Pages:** `concepts/chat.md`, `log.md`
- **Notes:** `ChatMessageAttachment` (24h TTL, REST upload/download); composer emoji picker; attach with confirm; removed thread action buttons.

## [2026-05-17] update | Realtime chat (Figma → production)

- **Trigger:** code change
- **Pages:** `concepts/chat.md`, `index.md`, `log.md`
- **Notes:** Prisma chat models; `module-chat` + Socket.IO gateway; GraphQL inbox/messages; `/chat` UI; sidebar badge; super-admin masked as admin; groups by admin/super-admin only.

## [2026-05-17] update | App confirm dialog replaces native alerts

- **Trigger:** code change
- **Pages:** `log.md`
- **Notes:** `ConfirmDialogHost` + `confirmDialog()` / `alertDialog()` in providers; delete word/quiz/user and lesson unlink/delete use modal; validation uses `toast.warning`.

## [2026-05-17] update | Practice quiz badge after generate

- **Trigger:** debug
- **Pages:** `log.md`
- **Notes:** Students: count from `studentQuizzes` (not stale `quizList`); staff: count from `quizzes` list; force refetch on `/practice`; backend auto-assigns generated quiz when vocabulary target is a student.

## [2026-05-17] update | Practice statPill layout + incomplete quiz count

- **Trigger:** code change
- **Pages:** `log.md`
- **Notes:** `statPill` top-right on activity cards; incomplete quizzes = assigned without `attempt.finishedAt`; sidebar badge uses same hook.

## [2026-05-17] update | Calendar drag/resize persists + Google Calendar patch

- **Trigger:** debug
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** DnD/resize calls `persistScheduleUpdate`; backend `GoogleCalendarService.updateEvent` on schedule change when `googleCalendarEventId` set.

## [2026-05-17] update | Fix super-admin vocabulary delete

- **Trigger:** debug
- **Pages:** `log.md`
- **Notes:** `deleteStudentCard` no longer blocks when actor id equals target id; staff self-list delete allowed; admin/super bypass student teacher check.

## [2026-05-17] update | Staff delete quiz and vocabulary cards

- **Trigger:** code change
- **Pages:** `concepts/vocabulary.md`, `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** GraphQL `deleteStudentWordCard`; quiz `delete` for teacher (own/assigned students), admin/super any. UI: trash on student vocab cards, Delete on quiz cards + GenerateQuizPanel list.

## [2026-05-17] update | Practice page stat pills & no CTA

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** `/practice` cards: no footer CTA; Vocabulary/Quiz `statPill` uses `usePracticePendingCounts` (new + `mistakes_work`, incomplete assigned quizzes).

## [2026-05-17] update | Practice badge, quiz completion UI, Create Quiz

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `concepts/quizzes-flashcards.md`, `log.md`
- **Notes:** Sidebar Practice badge = incomplete assigned quizzes + vocab (`new` + `mistakes_work`) via `usePracticeNavBadge` (tooltip when collapsed). Quiz page: student cards show attempt score; `QuizPlaySession` + `submitQuizAttempt`; Create New Quiz calls `generateQuiz`.

## [2026-05-17] update | Admin delete student with lessons

- **Trigger:** debug
- **Pages:** `log.md`
- **Notes:** `deleteAdminUser` removes `ScheduledLesson` rows first (`onDelete: Restrict` blocked user delete).

## [2026-05-16] update | Telegram localhost bot-link flow

- **Trigger:** code change
- **Pages:** `concepts/auth-rbac.md`, `log.md`
- **Notes:** `TelegramLinkToken`, `link/start` + polling on localhost; Login Widget unchanged on production.

## [2026-05-16] update | Telegram widget-config for Profile Connect

- **Trigger:** code change
- **Pages:** `concepts/auth-rbac.md`, `log.md`
- **Notes:** `GET /auth/telegram/widget-config`; username via `getMe` if only token set; UI warns on localhost.

## [2026-05-17] update | Telegram notification delivery

- **Trigger:** user note
- **Pages:** `concepts/profile-notifications.md`, `log.md`
- **Notes:** `NotificationDispatchService` sends email + Telegram; per-channel dedupe; welcome on Telegram link.

## [2026-05-17] update | Facebook and Telegram profile connections

- **Trigger:** user note
- **Pages:** `concepts/auth-rbac.md`, `log.md`
- **Notes:** `GET /auth/facebook/link` + callback; `POST /auth/telegram/link` with Login Widget hash verify; Profile Connections UI.

## [2026-05-17] update | Profile Google link (Connections tab)

- **Trigger:** user note
- **Pages:** `concepts/auth-rbac.md`, `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `GET /auth/google/link` for logged-in users; `myProfile.linkedAccounts`; Connect Google on Profile → Connections; lesson error points to Connections.

## [2026-05-17] update | Require Google Calendar to schedule lessons

- **Trigger:** user note
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `assertTeacherCalendarReady` before create; rollback lesson if Calendar event fails; toast/dialog with clear message.

## [2026-05-17] update | Meet auto on lesson create (no Create link UI)

- **Trigger:** user note
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Meet + Calendar on `LessonsService.create` with URL retry; removed manual Create Meet button; `LessonMeetButton` join-only.

## [2026-05-17] update | Scheduled lesson Meet ensure API

- **Trigger:** debug
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `ensureScheduledLessonMeet` GraphQL mutation; `POST /lessons/scheduled/meet`; dev watcher includes backend modules.

## [2026-05-16] update | Lesson modal "Open lesson page" link after create

- **Trigger:** debug
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** `LessonModal` uses `lessonBackendId` for link; after create modal stays in edit mode with link; `getLessonBackendId` in editor.

## [2026-05-16] update | Student lessons visibility + profile email after save

- **Trigger:** debug
- **Pages:** `concepts/lessons-calendar.md`, `concepts/web-app.md`, `log.md`
- **Notes:** Filter lessons with `lessonIncludesViewer` + `partyNumericId(auth id)`; `UPDATE_MY_PROFILE` returns `email`; profile store merges email on mutation.

## [2026-05-16] update | Vocabulary Play button / round building

- **Trigger:** debug
- **Pages:** `concepts/vocabulary.md`, `log.md`
- **Notes:** Play `canStart` uses `canBuildVocabularyPlayRound`; translation fallback to definition; ≥2 unique answers (not 4); last-lesson pool falls back when empty.

## [2026-05-16] update | Lessons list duplicate React keys fix

- **Trigger:** debug
- **Pages:** `concepts/lessons-calendar.md`, `log.md`
- **Notes:** Split lesson vs party numeric id maps; dedupe/upsert in `ScheduledLessonsProvider` + `LessonsListPanel` keys via `backendId`.

## [2026-05-17] update | Practice sessions in PostgreSQL

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `concepts/graphql-api.md`, `log.md`
- **Notes:** `PracticeSession` model; `recordPracticeSession` / `practiceWeekSummary`; practice page uses API not mock log.

## [2026-05-17] update | Practice session tracking for vocab play and quiz

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** `usePracticeSessionTracker` on vocab play + quiz (superseded by DB-backed sessions).

## [2026-05-17] update | React Email for all transactional templates

- **Trigger:** code change
- **Pages:** `concepts/transactional-email.md`, `log.md`
- **Notes:** Replaced file-based `subject.txt`/`body.html` with `@be/email-templates` (React Email); API dev/build compiles package first.

## [2026-05-17] update | Profile notifications persistence + email delivery

- **Trigger:** code change
- **Pages:** `concepts/profile-notifications.md`, `concepts/web-app.md`, `concepts/transactional-email.md`, `entities/user.md`, `index.md`, `log.md`
- **Notes:** User notification booleans, `NotificationDelivery`, `TeacherMessage`, `module-notifications` cron jobs, Profile tab API save, `sendTeacherMessage` + student compose UI.

## [2026-05-17] update | Lesson save via REST PATCH + backendId

- **Trigger:** bug fix
- **Pages:** `concepts/web-app.md`, `log.md`
- **Notes:** `updateScheduledLesson` uses `PATCH /api/lessons/scheduled/:id` (not GraphQL); `ScheduledLessonDto.backendId`; no post-save full refetch that wiped content.

## [2026-05-17] update | Dark toasts + lesson content save

- **Trigger:** bug fix
- **Pages:** `concepts/web-app.md`, `log.md`

## [2026-05-16] update | Toast notifications (addax port)

- **Trigger:** code change
- **Pages:** `concepts/web-app.md`, `log.md`

## [2026-05-16] update | Lesson materials & student response persist

- **Trigger:** bug fix
- **Pages:** `concepts/graphql-api.md`, `concepts/lessons-calendar.md`, `log.md`

## [2026-05-16] update | Student quiz tab & staff-only generate

- **Trigger:** code change
- **Pages:** `concepts/quizzes-flashcards.md`, `log.md`

## [2026-05-16] update | Vocabulary Play uses word translation

- **Trigger:** code change
- **Pages:** `concepts/vocabulary.md`, `log.md`

## [2026-05-16] update | Vocabulary add validation & UI

- **Trigger:** code change
- **Pages:** `concepts/vocabulary.md`, `log.md`

## [2026-05-16] ingest | LLM Wiki bootstrap

- **Raw:** _(pattern doc — conversational)_
- **Pages touched:** `index.md`, `log.md`, `overview.md`, `synthesis/architecture.md`
- **Notes:** Initial wiki scaffold for SoEnglish.

## [2026-05-16] ingest | Monorepo inventory audit

- **Raw:** `raw/code-audit/2026-05-16-monorepo-inventory.md`
- **Pages touched:** `synthesis/product`, `synthesis/tech-stack`, `synthesis/architecture`, `overview`, `sources/2026-05-16-monorepo-inventory`

## [2026-05-16] ingest | RBAC audit

- **Raw:** `raw/code-audit/2026-05-16-rbac.md`
- **Pages touched:** `concepts/auth-rbac`, `concepts/roles-matrix`, `entities/user`, `sources/2026-05-16-rbac`

## [2026-05-16] update | Domain entities & concepts

- **Trigger:** code audit (Phase 3)
- **Pages touched:** all `entities/*` (12), `concepts/graphql-api`, `lessons-calendar`, `vocabulary`, `quizzes-flashcards`, `progress-tracking`

## [2026-05-16] update | Frontend documentation

- **Trigger:** code audit (Phase 4)
- **Pages touched:** `concepts/web-app`, `concepts/ui-design-system`, `concepts/frontend-packages`

## [2026-05-16] update | Materials reference policy

- **Trigger:** user
- **Pages touched:** `overview` (link); added `docs/reference/materials-index.md`, `.cursor/rules/materials-readonly.mdc`
- **Notes:** `materials/` read-only for agent; not product truth

## [2026-05-16] update | System page — test email (super-admin)

- **Trigger:** user request
- **Pages:** `concepts/transactional-email`, `concepts/web-app`

## [2026-05-16] update | Admin provisioning + welcome email

- **Trigger:** user request
- **Pages:** `concepts/auth-rbac`, `entities/user`; added `packages/backend/email-templates/`, `module-mail`

## [2026-05-16] update | Disable public registration

- **Trigger:** user request
- **Pages:** `concepts/auth-rbac`, `concepts/roles-matrix`, `concepts/web-app`, `overview`

## [2026-05-16] update | Profile statistics — API only

- **Trigger:** user bug (mock Lesson hours 3.7h on Profile)
- **Pages:** `concepts/web-app`
- **Notes:** `ProfileLiveStatistics`, `useProfileLiveStats`; mock `StatisticsDashboard` removed from profile.

## [2026-05-16] update | Wiki rules — proactive maintenance

- **Trigger:** user note (agent should update wiki without being asked)
- **Pages:** _(rules only)_ `.cursor/rules/llm-wiki-triggers.mdc`, `llm-wiki.mdc`, `karpathy-guidelines.mdc`
- **Notes:** Explicit priority over "don't edit markdown"; same-session checklist; opt-out only via **skip wiki**.

## [2026-05-16] update | Student profile route uses API UUID

- **Trigger:** debug (Student not found after admin create)
- **Pages:** `concepts/web-app`
- **Notes:** `/students/[studentId]` resolves via `students` GraphQL + `lib/student-profile.ts`; list links use `row.id` (UUID).

## [2026-05-16] update | API env + dev script hardening

- **Trigger:** debug (SMTP not configured; EADDRINUSE / ECONNREFUSED)
- **Pages:** `concepts/graphql-api`, `concepts/transactional-email`
- **Notes:** `load-env.ts`, `--env-file` in dev/start; `dev.cjs` serial restarts, no `freePort` on every rebuild.

## [2026-05-16] update | API dev — compile then run dist

- **Trigger:** debug (systemMailStatus missing — stale/crashed tsx dev)
- **Pages:** `concepts/graphql-api` (dev note)
- **Notes:** `apps/api` dev uses `tsc` watch + `node --watch` on `dist/` so Nest decorators and workspace packages work.

## [2026-05-16] update | Vocabulary enrichment + lesson vocab UX

- **Trigger:** plan implementation
- **Pages:** `entities/word`, `concepts/vocabulary`, `concepts/graphql-api`, `log.md`
- **Notes:** WordEnrichmentService (dictionaryapi + Datamuse + CEFR JSON); `lookupWord` GraphQL; lesson form `linkedWordIds`; `LessonVocabularyAddPanel` replaces mock add in `LessonContentTab`.

## [2026-05-16] update | Plan lesson persists to DB

- **Trigger:** code change
- **Pages:** `entities/scheduled-lesson`, `concepts/graphql-api`, `log.md`
- **Notes:** `createScheduledLesson` wired from calendar + lessons Plan lesson modal; GraphQL input extended (`teacherId`, `duration`, `timezone`, notes, series).

## [2026-05-16] update | Assignable teachers & lesson party selects

- **Trigger:** code change (admin teacher assignment + Plan lesson modal)
- **Pages:** `concepts/graphql-api`, `log.md`
- **Notes:** `assignableTeachers` query (TEACHER/ADMIN/SUPER_ADMIN); `createUserAsAdmin` accepts those roles as `teacherId`; admin UI + Plan lesson Teacher/Student selects load from API (`useLessonPartyOptions`).

## [2026-05-16] update | Remove CEFR from Word vocabulary

- **Trigger:** user request
- **Pages:** `entities/word.md`, `concepts/vocabulary.md`, `log.md`
- **Notes:** Dropped `CefrLookupService`, `cefr-lemmas.json`, `Word.cefrLevel`, GraphQL/UI fields.

## [2026-05-16] update | Word audio + dictionary enrichment

- **Trigger:** code change
- **Pages:** `entities/word.md`, `log.md`
- **Notes:** `origin` on Word; dictionaryapi parsing (audio URL `https:`, POS priority, phonetic from audio row); `WordCardAudioButton` on vocabulary/lesson cards and add-word preview.

## [2026-05-16] update | Languages, WordDefinition, word details modal

- **Trigger:** code change
- **Pages:** `entities/language.md` (new), `entities/user.md`, `entities/word.md`, `concepts/vocabulary.md`, `index.md`, `log.md`
- **Notes:** `Language` catalog; `nativeLanguageId`; admin-only `StudentLearningLanguage`; `WordDefinition` + MyMemory translations; `wordDetails` / modal; scripts `prisma:seed:languages`, `prisma:backfill:languages-words`.

## [2026-05-16] update | System word dictionary provider (super-admin)

- **Trigger:** code change | user request
- **Pages:** `concepts/vocabulary.md`, `log.md`
- **Notes:** `PlatformSettings.wordDictionaryProvider` (`dictionary_api_dev` | `wiktionary`); System → Word dictionary tab; Wiktionary REST `/page/definition/{word}`; fallback to dictionaryapi.dev on miss.

## [2026-05-16] update | Multi–part-of-speech vocabulary

- **Trigger:** code change | user report (homograph `kind`)
- **Pages:** `concepts/vocabulary.md`, `entities/word.md`, `log.md`
- **Notes:** Dictionary API full array stored; `WordDefinition.partOfSpeech` + unique `(wordId, languageId, partOfSpeech)`; modal shows all POS badges and per-POS native translations; `getWordDetails` backfills legacy rows.

## [2026-05-16] lint | Full project bootstrap

- **Trigger:** Phase 5 health check
- **Pages touched:** `index.md` (full rebuild)
- **Notes:** 29 wiki pages cataloged; cross-links verified; no orphan entity pages; known gaps documented in `concepts/auth-rbac`. Added `karpathy-guidelines.mdc` for coding discipline.
