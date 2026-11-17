---
name: nextjs-frontend
description: "Implement, debug, and review this repository's Next.js frontend with its App Router, React, TypeScript, authentication, and UI stack."
---

# Next.js Frontend

Use this guidance for frontend work in `src/frontend/web-app`. Adapt it to existing patterns rather than introducing unrelated architecture or dependencies.

## Repository stack and workflow

- The app uses the Next.js App Router, React, and TypeScript. Routes and layouts live under `app/`; shared UI is organized in the existing route/component folders.
- Styling and UI use Tailwind CSS 4 and Flowbite React. Reuse existing components and visual conventions.
- Authentication uses NextAuth v5; client state uses Zustand; live auction updates use SignalR. Follow existing integration patterns for these features.
- Read `src/frontend/web-app/AGENTS.md` and the relevant installed Next.js guide under `src/frontend/web-app/node_modules/next/dist/docs/` before making framework changes. This project may use Next.js APIs that differ from prior versions; heed current docs and deprecations.
- Before editing, identify the route/component flow, relevant configuration, and any tests or scripts. Keep changes scoped to the requested behavior.

## Next.js and React

- Prefer Server Components by default. Add `"use client"` only where browser APIs, hooks, event handlers, or client-only libraries require it, and keep the client boundary as small as practical.
- Use the App Router conventions for routes, layouts, loading, errors, metadata, and route handlers. Do not introduce Pages Router patterns.
- Fetch data on the server when appropriate. For browser-side requests, use the existing `lib/fetchWrapper.ts` and nearby patterns; handle loading, empty, and error states explicitly.
- Use typed component props and existing domain types. Avoid `any`, unsafe casts, and duplicated API/domain models.
- Preserve accessible semantics: label inputs, support keyboard interaction, provide meaningful button names, and expose validation and status messages.
- Keep secrets server-side. Do not expose credentials or private tokens in client code or `NEXT_PUBLIC_*` variables. Treat browser and API data as untrusted.
- For forms, follow existing React Hook Form patterns and display validation or request failures instead of silently ignoring them.
- For shared or live client state, follow existing Zustand and SignalR providers; avoid duplicating sources of truth or leaking subscriptions/listeners.

## Styling and behavior

- Match the established Tailwind, Flowbite, and component patterns. Avoid broad restyling when the task only requires a functional change.
- Ensure layouts remain usable at narrow viewport widths and do not rely on color alone to convey state.
- Preserve existing navigation, authentication, and auction behavior unless the task explicitly changes it.
- Do not suppress errors or show success states when an operation failed. Surface actionable feedback using established UI patterns.

## Validation

- Run commands from `src/frontend/web-app`.
- Use `npm run lint` for lint validation and `npm run build` when changes affect compilation, routes, or production behavior.
- Add or update focused tests when the project has an appropriate test setup; otherwise validate the changed behavior with the most relevant available checks.
- Report the exact checks run and any validation that could not be completed.
