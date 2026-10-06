# MLTS Consumer Support Learning Hub

A desktop-only learning hub for practicing Microsoft consumer support conversations and skills. It is a practice site, not a live support service.

## What’s in the hub

- **Customer Chat Simulator** — Copilot Studio, version **10.1** (project-owner reported); Windows, Office, product activation, volume licensing, and Remote Desktop Server license management.
- **Quiz Gauntlet** — Copilot Studio, version **6.2** (project-owner reported); Windows and Office.
- **Typing Master** — 90-second typing practice with a results dialog.
- **Reply Remix** — 250 randomized support scenarios; an answer is required before continuing.
- **Skyfall** — 2.5D canvas landing game with three difficulty settings and hazards.
- **Fix for the Day** — curated support-learning cards rotate every 360 seconds.
- **Meet the Team** — team profiles and a read-only Life Cycle timeline of website milestones and Copilot Studio updates.
- **Seven themes** and a first-visit “Start here” prompt.

Simulator versions and feedback status are recorded from project-owner updates and may change. The customer simulator feedback section is currently being updated; deployment is pending confirmation. The Life Cycle page is maintained as changes are reported.

## Remember how it was built

1. Start with a **React + Vite** app and build the hub shell, navigation, and reusable cards.
2. Embed the published **Copilot Studio** bots in iframes; provide direct links for opening them in a new tab.
3. Build the learning activities in React; use the browser **Canvas API** for Skyfall.
4. Style the site with **CSS**, shared theme variables, inline SVG icons, and restrained animation.
5. Keep it client-side and static: no app database or custom backend is required. Theme and first-visit preferences use browser local storage.
6. Run the production build and publish the generated `dist/` folder to **Vercel** or **Render Static Sites**.

## Tech stack

- React 19, JavaScript/JSX, Vite 8
- CSS; inline SVG icons; HTML Canvas API for Skyfall
- Node.js and npm for development, linting, and builds
- Microsoft Copilot Studio for the customer and quiz simulators
- Vercel and Render for static hosting

## Run locally

Requirements: Node.js and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL, usually `http://localhost:5173`.

```sh
npm run lint       # check JavaScript/JSX
npm run build      # create the production site in dist/
npm run preview    # preview the production build locally
```

## Deploy

Both hosts deploy the Vite static site from the repository root:

- **Build command:** `npm ci && npm run build`
- **Publish/output directory:** `dist`

The embedded simulators depend on their Copilot Studio bots being published and available. The site’s themes and first-visit prompt are stored in the visitor’s browser; activity progress is not saved by the site.

## Project layout

```text
src/App.jsx       Site views, learning modules, content, and interactions
src/index.css     Layout, themes, and visual styling
src/main.jsx      React entry point
public/           Team portraits and static site assets
index.html        Page metadata and app mount point
vite.config.js    Vite configuration
```
