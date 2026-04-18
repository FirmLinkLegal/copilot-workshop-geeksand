# Kanban Board

A simple, client-side Kanban board built with **React 19**, **TypeScript**, and **Tailwind CSS v4**. Cards and board state persist to `localStorage` — no backend required.

## Features

- **3 columns** — To Do, In Progress, Complete
- **Add cards** — inline form at the bottom of each column
- **Edit cards** — inline edit form, pre-filled with existing content
- **Delete cards** — with confirmation prompt
- **Move cards** — dropdown on each card to switch columns
- **Reorder cards** — drag-and-drop within a column
- **Persistent** — survives page reloads via `localStorage`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm test` | Run tests (Vitest) |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility CSS |
| Vitest | — | Test runner |
| React Testing Library | — | Component testing |

## Project Structure

```
src/
├── types/kanban.ts          # Card & ColumnId types, COLUMNS config
├── hooks/useBoardState.ts   # State management + localStorage sync
├── components/
│   ├── KanbanBoard.tsx
│   ├── Column.tsx
│   ├── Card.tsx
│   ├── CardForm.tsx
│   └── AddCardForm.tsx
├── App.tsx
└── App.css
```

See [CODEBASE.md](./CODEBASE.md) for a detailed walkthrough of the architecture and each feature.
