# MLTS Consumer Support Learning Hub

A desktop-only practice hub for Microsoft consumer support conversations, product knowledge, and short skill activities. It is a learning tool, not a live support service.

## What is included

- **Customer Chat Simulator** — Copilot Studio, version **10.2**; practice Windows, Office, product activation, volume licensing, and Remote Desktop Server license management.
- **Quiz Gauntlet** — Copilot Studio, version **6.3**; Windows and Office knowledge practice.
- **Typing Master** — a 90-second typing session with live speed and accuracy and a compact results dialog.
- **Reply Remix** — 250 randomized support scenarios. Each answer is reviewed before the next scenario is enabled.
- **Skyfall** — a 2.5D canvas landing game with three difficulty settings, hazards, and a personal best.
- **Fix for the Day** — support-learning cards that rotate every 360 seconds.
- **Meet the Team** — a photo-free roster and a read-only timeline of website and Copilot Studio milestones.
- **Seven visual themes** and a first-visit Start Here prompt.

The simulator versions and feedback status are owner-reported. The latest recorded confirmation is **6 October 2026**: Customer Chat 10.2 and Quiz Gauntlet 6.3 were both reported up to date, and the Customer Chat feedback section was reported updated. Check the Life Cycle page for the dated record; update it when the owner reports a newer simulator milestone or a website change is completed.

## Technology

- React 19 and JavaScript (JSX)
- Vite 8 for development and production builds
- CSS variables for layout and themes; inline SVG for interface icons
- HTML Canvas API for Skyfall
- Microsoft Copilot Studio bots embedded in iframes, with direct new-tab links
- Node.js and npm for local development, linting, and builds
- Vercel and Render Static Sites for hosting

The hub is a static client-side app. It has no app database or custom backend. The selected theme, Start Here dismissal, and Skyfall best score use browser local storage; other activity progress is not saved.

## Run locally

Install a current Node.js release and npm, then run:

```sh
npm ci
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

Useful project commands:

```sh
npm run lint       # lint the project
npm run build      # write the production site to dist/
npm run preview    # preview the production build locally
```

## Deploy

The Vercel and Render static-site deployments use the repository root:

- **Build command:** `npm ci && npm run build`
- **Publish/output directory:** `dist`

The embedded simulators require their Copilot Studio bots to be published and accessible. If an embed is slow or blocked, use **Open in new tab**. The website can report that the iframe page loaded, but it cannot inspect whether the cross-origin bot itself is ready or responding.

The hub is intended for desktop browsers. It displays a desktop-required message when the device does not meet its desktop pointer and viewport checks.

## Project layout

```text
src/App.jsx       Views, modules, simulator records, and Life Cycle content
src/index.css     Layout, themes, interaction states, and motion rules
src/main.jsx      React entry point
public/MS.svg     Site brand mark
index.html        Page metadata and app mount point
vite.config.js    Vite configuration
```

## Keeping the Life Cycle accurate

The team page contains two separate histories:

1. **Website Life Cycle:** record completed modules, design changes, fixes, and removals in `lifeCycleVersions` in `src/App.jsx`. Use repository commit dates and hashes when available. Do not invent commit details for work that is not yet committed.
2. **Copilot Studio Timeline:** record simulator milestones only from owner-provided dates and version details. Keep that history separate from website commits, and update the model records and feedback status when the owner confirms a change.

Keep the built-in Website Manual and this README aligned whenever visible modules or behavior change. The Life Cycle is a read-only history, not a navigation menu.
