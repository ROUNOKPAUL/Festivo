# Concert & Festival Finder

A React + JavaScript single-page app for browsing live concerts and festivals — search, filter by genre/city/type, and view event details in a modal. Styled as gig posters and ticket stubs.

## Tech
- React 18
- Vite (dev server + bundler)
- Plain CSS (inline style objects, no CSS framework)
- Mock event data (easy to swap for a real API like Ticketmaster or Bandsintown)

## Run it locally

1. Install dependencies (only needed once):
   ```
   npm install
   ```
2. Start the dev server:
   ```
   npm run dev
   ```
3. Open the URL it prints (usually `http://localhost:5173`) in your browser.

## Build for production
```
npm run build
```
Outputs static files to `dist/`, which you can deploy anywhere (Vercel, Netlify, GitHub Pages).

## Project structure
```
concert-festival-finder/
├── index.html          # HTML entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx         # mounts React app
    └── App.jsx          # the whole app: data, filtering logic, UI
```
