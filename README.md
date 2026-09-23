# Support Academy

A Vite and React learning site with two Copilot Studio practice modules:

- **Customer Conversation Lab** for support conversation practice
- **Knowledge Sprint** for product knowledge checks

Each module opens its Copilot Studio Web Chat inside an iframe.

## Requirements

- Node.js and npm
- A Copilot Studio agent published for Web Chat

## Run locally

1. Open a terminal in the project folder.
2. Install the project dependencies:

   ```sh
   npm install
   ```

3. Start the Vite development server:

   ```sh
   npm run dev
   ```

4. Open the local address printed in the terminal.

To create a production build, run:

```sh
npm run build
```

Vite writes the production files to `dist/`. The project’s `package.json` must include the usual `dev` and `build` scripts for these commands.

## Update the Copilot Studio chat URLs

The simulator definitions are in `src/App.jsx` in the `simulators` object. Update the `url` for the relevant module with that agent’s Web Chat embed URL from Copilot Studio. Both current URLs use the `/webchat` route.

The site displays each URL in an iframe. The iframe’s size and placement are controlled by `src/index.css`; the chat interface itself is provided by Copilot Studio.

## Main files

- `src/App.jsx` — home page, module cards, and simulator iframe
- `src/index.css` — colors, layout, responsive styles, and reduced-motion behavior
- `vite.config.js` — Vite configuration with the React plugin and `/` base path

## Deployment

Build the site with `npm run build`, then deploy the generated `dist/` folder using your hosting provider’s Vite/static-site instructions. The Vite config uses `base: '/'`, which is appropriate when the app is hosted at the root of a domain. If it is hosted under a subpath, update `base` in `vite.config.js` to match that path and rebuild.
