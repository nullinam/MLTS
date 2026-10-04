# MLTS Consumer Simulator

A browser-based Microsoft consumer support learning hub built with React and Vite. It combines Copilot Studio practice simulators with lightweight activities for typing, product knowledge, customer communication, and support fundamentals.

## Features

- **Customer Chat Simulator** — Copilot Studio conversation practice for listening, clarifying customer needs, and giving clear next steps.
- **Quiz Gauntlet** — a Copilot Studio quiz for exploring consumer Microsoft products and prompting product-knowledge recall.
- **Typing Master** — a 90-second typing test. The timer starts on the first keystroke. Thirty varied passages are randomized, with live character highlighting, WPM, accuracy, and an animal skill badge.
- **Skyfall** — an endless, colorful perspective-style parachute game. Steer with keyboard or touch controls, land on platforms, avoid wind gates and storms, and collect shields. It uses a canvas-based 3D-style perspective rather than a full 3D engine.
- **Reply Remix** — 100+ randomized customer situations. Questions are shuffled without repeats until the question bank cycles.
- **Fix for the Day** — a 69-card support learning deck covering Windows, Microsoft 365, accounts, billing, licensing, Remote Desktop Services, and sales topics. Cards rotate on a shared schedule every 5–10 minutes, reshuffle after each cycle, and have no manual navigation, visible countdown, or saved state. The cards are static learning content, not live Microsoft news, and do not redirect to external pages.
- **India calendar** — a month view with live India time, public holiday feeds, region filters, and context for global, technology, and Microsoft observances. Regional and lunar festival dates can vary by source and tradition.
- **Themes** — light and dark modes, a restrained Microsoft 50 Years theme, plus developer and customer support themes with matching icons. Light mode is the default.
- **Website Manual** — explains the purpose of each learning feature.
- **Meet the Team** — calm, consistent profile cards that foreground each team member’s portrait and name.
- **Responsive and accessible presentation** — adapts to mobile screens, includes keyboard focus styles, and respects reduced-motion preferences.

## Privacy and data

Typing results, game scores, and the current Fix for the Day card are not saved. The learning activities run in the browser and do not require a database or a separate API service. The calendar needs an internet connection to synchronize its date and retrieve holiday data. Copilot Studio simulators load in embedded frames and are operated by their configured Copilot Studio agents.

## Requirements

- Node.js and npm
- Copilot Studio agents published for Web Chat

## Run locally

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
