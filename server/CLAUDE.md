# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

HelpDesk backend: NestJS 12 (ESM) with Better Auth and Prisma 7 on PostgreSQL. The Next.js frontend is in `../web`. `../docker-compose.yml` runs web (3000), server (4000) and Postgres together, and the server's `.env` is also the env file for the Postgres container.

## Coding style (mandatory)

**Before every change, read `../CODING_STYLE.md` and follow it.** It applies to all code in this server. It covers:

- formatting
- file and identifier naming
- blank lines
- order within files, imports and classes
- function forms and parameters
- control flow
- types and exports
- comments
- the language of code vs. user-facing text

Prettier and oxlint enforce only a small part of it. Check new and changed code against the guide yourself before you finish.

The server rules are the `server` column of its tables and the parts marked "(Server)". On style, the guide takes precedence over the NestJS skills and your own defaults.

Some of its examples (`mail.service.ts`, `canSendMail`, `sendPasswordResetEmail`) refer to code that doesn't exist in this server yet. The rules still apply.

## Commands

```bash
npm run start:dev          # watch mode; needs .env (copy .env.example) and a reachable Postgres
npm run build              # nest build -> dist/
npm run lint               # oxlint --type-aware; no-floating-promises is an error
npm run format             # prettier: single quotes, trailing commas
npm test                   # vitest, *.spec.ts next to the code
npx vitest run src/auth/auth.factory.spec.ts   # one file
npx vitest run -t "name of the test"           # by test name
npm run test:e2e           # *.e2e-spec.ts via vitest.config.e2e.ts
npm run openapi            # builds, boots AppModule, writes openapi.json (needs a valid .env)
```

Prisma reads `prisma7.config.ts`, which Prisma 7 detects on its own. It loads `DATABASE_URL` through `dotenv`.

```bash
npx prisma generate                              # required after clone: the client is gitignored
npx prisma migrate dev --name <descriptive_name> # new migration + regenerate
npm run better-auth:generate                     # regenerate schema.prisma from the Better Auth config
```

Don't use `npm run prisma` any more. It hard-codes `--name init`, and that migration already exists. Name new migrations after what they change, e.g. `add_user_fields`. The Docker image applies them on start with `prisma migrate deploy`.

## Architecture

**Bootstrap.** `src/main.ts` creates the app with `bodyParser: false`, which Better Auth needs. `@thallesp/nestjs-better-auth` adds JSON/urlencoded parsing back for every other route, so NestJS's own `rawBody` option has no effect; use the library's `bodyParser.rawBody` instead. The global prefix comes from `GLOBAL_PREFIX` (`api/v1`). Swagger UI is served at `/api/v1/api-docs`, with the JSON at `/api/v1/api-docs-json`. `src/generate-openapi.ts` repeats the prefix and `buildSwaggerDocument` setup, so keep the two files in step.

**Validation.** `AppModule` registers a global `ValidationPipe` as an `APP_PIPE` provider (not via `useGlobalPipes`, so testing modules built from `AppModule` get it too), with these options:

- `whitelist`
- `forbidNonWhitelisted`: unknown body fields are a 400, not silently dropped
- `transform`: DTO instances; path/query params are converted to their declared types

DTOs use class-validator decorators.

**Configuration.** `ConfigModule.forRoot({ validate })` runs the class-validator schema in `src/config/env.validation.ts` at startup. Every variable is required (including `PORT`), so the app won't boot if any of them is missing or invalid. Read env only through `AppConfigService` getters. A new variable is added in three places, in the same comment group each time: the validator class, a getter, and `.env.example`. The `POSTGRES_*` keys in `.env.example` are not read by the app.

**Infrastructure modules** live in `src/config/<name>/` and are `@Global()`, so you can inject `PrismaService` and `AppConfigService` anywhere without importing their modules. `PrismaService` extends the generated client and uses the `@prisma/adapter-pg` driver adapter. Prisma 7 has no `url` in `schema.prisma`: the CLI gets the URL from `prisma7.config.ts`, and at runtime `PrismaService` passes `AppConfigService.databaseUrl` to the adapter. Import Prisma types from `src/config/prisma/generated/client.js`, not from `@prisma/client`.

**Auth** is Better Auth. Don't add `@nestjs/authentication`, `@nestjs/authorization` or a second guard layer, even though the installed `nestjs-auth` skill recommends them.

- `src/auth/auth.factory.ts` (`createAuth`) holds the only Better Auth config. `AuthModule` builds it via `BetterAuthModule.forRootAsync`, with `PrismaService` and `AppConfigService` injected.
- `src/auth/auth.ts` is a stub instance with `{}` dependencies, only for the Better Auth CLI. Never import it at runtime.
- Auth routes live under `/${GLOBAL_PREFIX}/auth/*`. Cookies use the prefix `helpdesk`, so the session cookie is `helpdesk.session_token`, which `swagger.config.ts` also names. In production, `crossSubDomainCookies` sets the cookie for `DOMAIN` (`AppConfigService.cookieDomain`). `DOMAIN` therefore has to be the parent domain that both web and API run under. `FRONTEND_URL` is the only trusted origin.
- Plugins: `admin` (roles `user`/`admin`; adds the `role`/`banned*` user columns and `impersonatedBy` on sessions) and `openAPI`.
- `AuthModule` registers a global `AuthGuard`: every route requires a session unless it is marked `@AllowAnonymous()` or `@OptionalAuth()`. Get the session with `@Session()` and restrict by role with `@Roles([...])`. The module also enables CORS with credentials for `trustedOrigins`, so don't call `app.enableCors()` in `main.ts`.
- `prisma/schema.prisma` mirrors the Better Auth config (`user`, `session`, `account`, `verification`). To change auth-related data (plugins, `user.additionalFields`), edit `createAuth`, then run `npm run better-auth:generate`, then a migration.

**Things that must stay in sync with `../web`:**

- `../web/src/api/auth-client.ts`: `basePath: "/api/v1/auth"` has to match `GLOBAL_PREFIX` + `/auth`. Client plugins mirror the server plugins (`adminClient` ↔ `admin()`), and `inferAdditionalFields` has to match `user.additionalFields` in `createAuth` plus the Prisma columns.
- `openapi.json` (written to `server/`) is the input for `../web/orval.config.ts`, which generates the web API hooks. Re-run `npm run openapi` after you change controllers or DTOs.

**Deployment.** The `prod` stage of the `Dockerfile` waits for Postgres (`wait-for-db.sh <host>`), then runs `prisma migrate deploy` and `npm run start:prod`.

## NestJS

This app's NestJS version (12) is likely newer than what you know. https://docs.nestjs.com/llms.txt indexes the docs, with one markdown page per chapter. The official NestJS agent skills are in `.claude/skills/` (update them with `npx @nestjs/skills add --agent claude`), and so are the Prisma and Better Auth skills. For persistence, use the `prisma-*` skills: `nestjs-data` covers Drizzle/TypeORM, which this project doesn't use.

Before adding a library or writing your own, check whether Nest has a first-party package for it: config, swagger, throttler, terminus, cache-manager, event-emitter, schedule, bullmq, mail, storage, i18n, resilience, idempotency, outbox, webhooks, locks, workflows, ai, mcp. The docs index lists them.

Validation works with `class-validator` through `ValidationPipe` (this project already uses class-validator for env), or with any Standard Schema library through `StandardSchemaValidationPipe` and `@Body({ schema })`.

ESM: relative imports end in `.js`, Node builtins use `node:`, `__dirname` doesn't exist (use `import.meta.dirname`), and entry points use top-level `await`. Tests run on Vitest with globals, so mocks are `vi.fn()`, not `jest.fn()`.

When a task says how to test, follow it. When it says nothing, cover the behaviour you change with focused tests rather than adding broad e2e suites. There are no tests yet.

## Production data: NestJS Observe

Observe is not set up yet: there is no `ObserveModule` in `AppModule`. `npx @nestjs/observe link` installs and wires it, and writes `OBSERVE_APP_KEY`/`OBSERVE_APP_SECRET` to `.env`. Once it runs, answer questions about production behaviour (errors, slow endpoints, regressions after a release) from its data instead of the code alone. Use the Observe MCP server (`claude mcp add observe --transport http https://observe-api.nestjs.com/mcp`, Pro plan) or the dashboard's **Copy agent prompt**.
