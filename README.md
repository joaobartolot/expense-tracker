# Expense Tracker (React + Vite + Tailwind + TypeScript)

A scalable frontend architecture for a personal finance app focused on clarity and maintainability.

## Features

- Monthly overview (spent, earned, net)
- Transactions grouped by date (Today / Yesterday / historical)
- Income and expense tracking
- Multiple accounts (bank and cash)
- Default and custom categories with icons
- Recurring transactions with "Apply Due"
- Goals with progress and monthly savings guidance
- Default currency settings + transaction-level currency conversion
- Dashboard visualizations:
    - Spending by category
    - Net worth trend

## Project Architecture

```text
src/
  app/                # Page composition layer
  components/
    common/           # Shared UI primitives (Card, Header)
    dashboard/        # Dashboard widgets/charts/lists
    forms/            # Data entry panels
    goals/            # Goal-specific UI
    settings/         # Settings UI
  data/               # Static constants/defaults
  hooks/              # Reusable state/data hooks
  state/              # Reducer + actions + initial state
  utils/              # Currency and date helpers
```

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` starts Vite on the local network and prints a QR code in the terminal so you can open the app on your phone.

## Tooling

```bash
npm run typecheck
npm run lint
npm run format
```

- TypeScript is used across the application source.
- ESLint checks the TypeScript + React codebase.
- Prettier formats the project with a `tabWidth` of `4`.
- `prettier-plugin-tailwindcss` keeps Tailwind utility classes sorted automatically.

## Notes

- App state is persisted in browser `localStorage`.
- Exchange rates are fetched from `open.er-api.com` with fallback values for resilience.
