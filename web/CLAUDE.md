# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

HelpDesk frontend: Next.js 16 (App Router) with React 19 and the React Compiler, Tailwind CSS 4, shadcn/ui on Base UI, TanStack Query with Orval-generated hooks, and the Better Auth client. The NestJS backend is in `../server` (see `../server/CLAUDE.md`). `../docker-compose.yml` runs web (3000), server (4000) and Postgres together.

## Coding style (mandatory)

**Before every change, read `../CODING_STYLE.md` and follow it.** It applies to all code in this app. It covers:

- formatting
- file and identifier naming
- blank lines
- order within files, components and JSX props
- function forms
- control flow
- types and exports
- JSX and Tailwind
- comments
- language and tone of user-facing text (German, "Sie", `de-AT`)

ESLint enforces only a small part of it. Check new and changed code against the guide yourself before you finish.

The web rules are the `web` column of its tables plus the general rules. On style, the guide takes precedence over skills and your own defaults.

Vendored code in `src/components/ui/` (shadcn, Aceternity, MagicUI and other registries) keeps its upstream style and is not reformatted. That's why `button.tsx` uses `function` and has no semicolons.

## Next.js version

This is Next.js 16.4, which is newer than your training data. Read the matching guide in `node_modules/next/dist/docs/` before you use a Next.js API or file convention. The docs there match the installed version. Settings in `next.config.ts` that change how code has to be written:

- `cacheComponents: true`: Cache Components is on. Dynamic data access must sit inside `<Suspense>` or be cached with `'use cache'`. Check the docs before you fetch in a Server Component.
- `reactCompiler: true`: don't add `useMemo`, `useCallback` or `memo` without a concrete reason.
- `partialPrefetching: true` and `experimental.agentFeedback: true` are also set.
- Request interception goes in `src/proxy.ts`, Next 16's replacement for `middleware.ts` (`docs/01-app/03-api-reference/03-file-conventions/proxy.md`). The file doesn't exist yet.
- Tailwind 4 runs through the `@tailwindcss/turbopack` loader configured in `turbopack.rules`. There is no PostCSS config.

## Commands

```bash
npm run dev            # dev server on :3000; needs .env (NEXT_PUBLIC_API_URL) and the server on :4000
npm run build
npm run lint           # eslint: next/core-web-vitals + next/typescript
npx next typegen && npx tsc --noEmit   # type check; typegen creates LayoutProps/PageProps in .next/types
npm run openapi        # orval: regenerate src/api/generated from ../server/openapi.json
npx shadcn@latest add <component>               # add a shadcn component (style base-nova)
npx shadcn@latest add @aceternity/<component>   # from a registry in components.json
```

There is no test setup.

Both apps name their script `openapi`. Run `npm run openapi` in `../server` first to refresh `openapi.json`, then here. Orval's `afterAllFilesWrite` hook formats the generated files with Prettier (default config, so double quotes). `.prettierignore` excludes `src/components/ui` so vendored code isn't reformatted. Don't add `src/api/generated` to it, or the hook stops formatting those files.

## Architecture

**Path alias.** `@/*` points to `src/*`. Imports go through `@/`, also between sibling folders.

**API access** lives in `src/api/`. There are two clients and nothing else talks to the backend:

- `auth-client.ts`: the Better Auth React client (`authClient`). Use it for everything auth-related: sign-in/up/out, session, admin actions. `baseURL` is `NEXT_PUBLIC_API_URL`, `basePath` is `/api/v1/auth`.
- `axios-instance.ts`: an `axiosInstance` singleton with `withCredentials: true`, so the API's session cookie (`helpdesk.session_token`) is sent across origins. `customInstance` is the Orval mutator: it unwraps `response.data` and attaches `cancel()` via an `AbortController`. There is deliberately no 401 refresh interceptor. Better Auth has no refresh token: with the server's `deferSessionRefresh: true`, `authClient` extends the session itself via `POST /get-session`. A 401 from the API therefore means the session is gone.
- `generated/` (created by Orval, `tags-split` mode, models in `generated/models`): React Query hooks for all non-auth endpoints. Never edit it by hand.
- `query-provider.tsx`: one `QueryClient` per browser session (`staleTime` 60 s). `src/app/layout.tsx` wraps the app in it and renders the sonner `<Toaster>`.

**Environment.** The only variable is `NEXT_PUBLIC_API_URL`. Because of the `NEXT_PUBLIC_` prefix it is inlined at build time. The Docker build picks it up from `web/.env` in the build context, so changing the compose `env_file` at runtime has no effect. The web app has no config layer: clients read `process.env` directly.

**UI building blocks:**

- shadcn uses style `base-nova` with Base UI primitives (`@base-ui/react`), not Radix. Check a component's props against Base UI.
- `cn` comes from the npm package `cn`, a drop-in replacement for `clsx` + `tailwind-merge`. `src/lib/utils.ts` only re-exports it for the shadcn alias.
- Own code uses Iconify string IDs (`<Icon icon="lucide:mail" />`), as `sonner.tsx` does. Generated shadcn components may import `lucide-react`.
- `motion` handles animation, and `react-hook-form` + `zod` handle forms. `../CODING_STYLE.md` describes the form layering (schema → hook → form → card).

**Design.** `DESIGN.md` is the design reference, with tokens in its YAML front matter and component rules in the prose. `src/app/globals.css` still holds the shadcn neutral defaults. `sonner.tsx` uses `--success`/`--warning` tokens and mentions a "Status" section in `DESIGN.md`, but neither those tokens nor that section exist yet. Colours in components come only from the theme tokens, never as raw values.

**Things that must stay in sync with `../server`:**

- `src/api/auth-client.ts`: `basePath` has to match the server's `GLOBAL_PREFIX` + `/auth`. Client plugins mirror the server plugins (`adminClient` ↔ `admin()`). If the server adds `user.additionalFields` in `../server/src/auth/auth.factory.ts`, declare them here with `inferAdditionalFields`.
- `src/api/generated/` reflects `../server/openapi.json`. Regenerate it after server controllers or DTOs change.
- The server's `FRONTEND_URL` is its only trusted origin, so the web app must run at exactly that URL (`http://localhost:3000` locally). `NEXT_PUBLIC_API_URL` must point at the server (`http://localhost:4000`).
