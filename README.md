# Enterprise Pomodoro OS (React + TypeScript + Vite)

A local-first productivity suite with a backend-friendly architecture.

## Stack
- React 18 + TypeScript + Vite
- ESLint (flat config)
- TanStack React Query for all data operations
- LocalStorage repository (easy to swap with API)
- Recharts dashboard analytics

## Scripts
- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`

## Backend-ready design
All data access lives in `src/lib/storage.ts` and is consumed via React Query hooks in `src/hooks/useProductivity.ts`.
To integrate a backend later:
1. Replace repository methods with API calls.
2. Keep existing hooks and UI untouched (same query keys and payload contracts).
