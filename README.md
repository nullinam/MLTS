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
index.html           Vite HTML entry point and page metadata
vite.config.js       Vite configuration
```

## Deployment

### Website on Vercel

Deploy the repository as a Vite project. The production build command is `npm run build`, and the output directory is `dist`.

### Website on Render

Create a Render **Static Site** with the repository root as its root directory:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

## Browser storage and external services

The selected theme and dismissal of the first-visit prompt are stored in the browser’s local storage. Activity scores and typing results are not saved by the site. The embedded simulators are served by Microsoft Copilot Studio and are subject to Microsoft’s availability and privacy practices.
