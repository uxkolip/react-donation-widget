# Mock Checkout Page with Donations

This repository hosts a Vite-powered React demo that showcases two checkout experiences (classic and templated) plus a dropdown-based donation widget. It is intended to mirror a mock Figma flow for comparing donation UX patterns.

## Features

- React 18 + Vite
- Tailwind-inspired styling
- Custom widgets: donation amount picker, nonprofit selector, and dropdown-enabled widget
- React Router routes for Classic, Template, and Dropdown checkout flows
- GitHub Pages build & deploy workflow

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:5173/ by default. The terminal output logs the exact URL (including network URLs) that Vite opens.

## Scripts

- `npm run dev` — start the Vite dev server with hot module replacement
- `npm run build` — create a production-ready bundle in `dist/`

## Deployment

Changes pushed to `main` trigger `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to `gh-pages` via `peaceiris/actions-gh-pages`.

## Testing

This project does not include automated tests. Use the dev server (`npm run dev`) and browser inspection for visual verification.

## Contributions

Feel free to open issues or send pull requests to improve the donation widgets, routing, or styling. Ensure `npm run build` succeeds before submitting a PR.
# react-donation-widget

