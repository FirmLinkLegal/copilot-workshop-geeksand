# Codebase Overview — Kanban Board

## Project Structure

```
src/
├── types/
│   └── kanban.ts          # Core data types and column config
├── hooks/
│   └── useBoardState.ts   # All state logic + localStorage persistence
├── components/
│   ├── KanbanBoard.tsx    # Root board — wires hook to 3 columns
│   ├── Column.tsx         # A single column with its own drag state
│   ├── Card.tsx           # Individual card (display & edit mode)
│   ├── CardForm.tsx       # Reusable form for creating and editing cards
│   └── AddCardForm.tsx    # "+ Add card" button that toggles CardForm
├── App.tsx                # App shell — header + <KanbanBoard />
├── App.css                # All component styles (BEM class naming)
├── App.test.tsx           # Blackbox integration tests
├── index.css              # Global resets, CSS variables, Tailwind import
└── main.tsx               # React entry point
```

---

## Data Model (`src/types/kanban.ts`)

```ts
type ColumnId = 'todo' | 'in-progress' | 'complete'

interface Card {
  id: string        // crypto.randomUUID()
  title: string     // required
  body: string      // optional
  columnId: ColumnId
  order: number     // sort position within its column (0-based)
  createdAt: number // Date.now() timestamp
}
```

`COLUMNS` is an ordered array of `{ id, label }` objects that drives how many columns are rendered and what they are named. Adding a column is as simple as adding an entry here.

---

## State Management (`src/hooks/useBoardState.ts`)

`useBoardState` is the single source of truth. It owns a `Card[]` state array and returns the following API:

| Function | What it does |
|---|---|
| `addCard(columnId, title, body)` | Creates a new card with a UUID and appends it to the end of the specified column |
| `updateCard(id, title, body)` | Updates title/body on an existing card by ID |
| `deleteCard(id)` | Removes card by ID |
| `moveCard(id, targetColumnId)` | Changes a card's `columnId` and places it at the end of the target column |
| `reorderCards(columnId, fromIndex, toIndex)` | Re-numbers `order` on all cards in a column after a drag-and-drop |

**Persistence**: a `useEffect` watches `cards` and writes the whole array to `localStorage` under the key `kanban-board` on every change. On mount, `loadCards()` reads and parses that key, falling back to `[]` if the key is missing or the JSON is corrupt.

---

## Component Tree & Data Flow

```
App
└─ KanbanBoard  ← calls useBoardState(), distributes state & callbacks
   └─ Column (×3)  ← receives its slice of cards + all callbacks
      ├─ [column header with card-count badge]
      ├─ Card (×N)  ← draggable; has edit/delete/move affordances
      │  └─ CardForm  ← appears inline when Edit is clicked
      └─ AddCardForm  ← "+ Add card" button → inline CardForm
```

Props flow strictly downward. There is no context or global store — the hook at `KanbanBoard` level acts as the store.

---

## Feature Walkthroughs

### Adding a card
1. User clicks "+ Add card" at the bottom of a column.
2. `AddCardForm` toggles its `open` state to show a `CardForm`.
3. On submit, `addCard(columnId, title, body)` is called.
4. The new card appears at the bottom of the column; state is synced to localStorage.

### Editing a card
1. User clicks the ✏️ button on a card.
2. `Card` sets `editing = true`, replacing the display view with an inline `CardForm` (pre-filled).
3. On save, `updateCard(id, title, body)` is called; editing mode closes.

### Deleting a card
1. User clicks 🗑️. A `window.confirm()` dialog is shown.
2. On confirmation, `deleteCard(id)` removes the card from state and localStorage.

### Moving a card between columns
1. The `<select>` on each card lists the other two columns.
2. On change, `moveCard(id, targetColumnId)` updates `columnId` and appends the card to the end of the target column.

### Reordering within a column (drag-and-drop)
1. `Column` tracks `dragFromIndex` and `dragOverIndex` locally.
2. Native HTML5 drag events (`onDragStart`, `onDragOver`, `onDrop`) are attached to each `Card`.
3. On drop, `reorderCards(columnId, fromIndex, toIndex)` reassigns `order` values so the moved card lands at the correct position.
4. The drop highlight (`.card--drag-over`) gives visual feedback during dragging.

---

## Styling

`App.css` uses a **BEM-like** class naming convention (`.column`, `.column__header`, `.column__badge`, `.card`, `.card__title`, etc.).  
Colours and spacing are driven by CSS custom properties defined in `index.css`:

| Variable | Purpose |
|---|---|
| `--accent` | Purple highlight (#aa3bff) |
| `--accent-bg` / `--accent-border` | Tinted purple backgrounds and borders |
| `--border` | Subtle grey border colour |
| `--code-bg` | Off-white column background |
| `--text` / `--text-h` | Body and heading text colours |

Tailwind CSS v4 is imported in `index.css` for utility access but the component styles are hand-written in `App.css`.

---

## Testing

Tests live in `src/App.test.tsx` and use **Vitest** + **React Testing Library** + **@testing-library/user-event**.

The test suite is blackbox — it renders the full `<App />` (including `useBoardState` and localStorage) and interacts via visible UI elements only. `localStorage` is automatically isolated per test via `jsdom`.

Run tests:
```bash
npm test
```
