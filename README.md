# MLTS Consumer Simulator

MLTS is a browser-based learning hub for practicing Microsoft consumer support conversations and skills. The front end is built with React and Vite. Customer chat and product quiz activities open published Microsoft Copilot Studio bots in embedded web chat frames.

## What’s included

- **Customer Chat Simulator** — practice asking questions, understanding a customer’s issue, and explaining a useful next step.
- **Quiz Gauntlet** — practice recalling Microsoft consumer product information with a Copilot Studio quiz.
- **Typing Master** — complete a 90-second typing session and review speed and accuracy.
- **Reply Remix** — work through randomized customer-support situations and choose a helpful response.
- **Skyfall** — play a canvas-based landing game using keyboard or touch controls.
- **Fix for the Day** — read a rotating support learning card with a short explanation and customer scenario. The deck is curated learning content, not live product news or troubleshooting advice.
- **Meet the Team** and **Website Manual** — view team profiles and explanations of the learning activities.
- **Themes** — switch between Light, Dark, Microsoft 50 Years, Developer, and Customer Support appearances.
- **Start here** — a first-visit prompt that takes new visitors to the Customer Chat Simulator.

The simulators are practice experiences, not a live support channel. They depend on the Copilot Studio bots being published and available to the visitor.

## Run the website locally

### Requirements

- Node.js and npm
- Access to the repository

### Install and start

From the repository root, install the locked dependencies and start Vite:

```sh
npm ci
npm run dev
```

Vite prints the local development URL in the terminal, usually `http://localhost:5173`.

### Build and preview

Create a production build in `dist/` and serve it locally:

```sh
npm run build
npm run preview
```

`npm run lint` runs ESLint across the repository.

## Project layout

```text
src/                 React application and styles
public/              Static images and the site icon
api/                 Vercel serverless functions
Pulse-api/           Separate Node.js Microsoft feed API
index.html           Vite HTML entry point and page metadata
vite.config.js       Vite configuration
```

## Deployment

### Website on Vercel

Deploy the repository as a Vite project. The production build command is `npm run build`, and the output directory is `dist`. Vercel also detects the serverless functions in `api/`.

### Website on Render

Create a Render **Static Site** with the repository root as its root directory:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

The front end does not require the separate `Pulse-api` service to load its learning activities.

### Optional Microsoft feed API on Render

`Pulse-api/` contains a standalone Node.js HTTP service. It fetches official Microsoft RSS feeds and exposes:

- `GET /health` — health check
- `GET /api/microsoft-pulse` — recent feed items grouped into Consumer and Other Microsoft channels

To deploy it as a Render **Web Service**, set the root directory to `Pulse-api`, use `npm start` as the start command, and set `SITE_ORIGINS` to the comma-separated website origins allowed to call it. For example, use the exact HTTPS origin of the deployed static site. Requests from other origins are rejected. The service keeps feed results in memory briefly to reduce repeated upstream requests.

The current learning hub does not call this feed API; it is a separate service for deployments or integrations that need the feed.

## Optional Vercel feedback endpoints

The repository also contains two Vercel functions:

- `POST /api/feedback-code` emails a one-time verification code.
- `POST /api/feedback-submit` verifies the code and emails submitted feedback to the recipients approved in the function.

These functions require the Vercel environment variables `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `FEEDBACK_OTP_SECRET`. The secret must be at least 32 characters. The functions accept work addresses ending in `@concentrix.com` or `@microsoft.com`. They are API endpoints; the current learning hub does not include a feedback form that calls them.

## Browser storage and external services

The selected theme and dismissal of the first-visit prompt are stored in the browser’s local storage. Activity scores and typing results are not saved by the site. The embedded simulators are served by Microsoft Copilot Studio and are subject to Microsoft’s availability and privacy practices.
