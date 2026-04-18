# PRD: Simple Kanban Board

### Overview
A client-side Kanban board built with React 19 + TypeScript + Tailwind CSS v4. No backend — all state persisted to `localStorage`. Cards can be created, edited, deleted, moved between columns, and reordered within columns via drag-and-drop.

---

### 1. Tech Stack
- **Framework**: React 19 + TypeScript (Vite scaffold already in place)
- **Styling**: Tailwind CSS v4 (already installed)
- **Persistence**: `localStorage`
- **Testing**: Vitest + React Testing Library (already configured)
- **Drag-and-drop**: HTML5 native drag-and-drop API (no extra dependencies) — or `@dnd-kit/core` if native DnD proves insufficient

---

### 2. Data Model

```
Card {
  id: string          // uuid
  title: string       // required
  body: string        // optional
  columnId: ColumnId
  order: number       // sort index within a column
  createdAt: number   // timestamp
}

ColumnId: "todo" | "in-progress" | "complete"

Board {
  cards: Card[]
}
```

Stored as a single JSON blob under localStorage key `kanban-board`.

---

### 3. Features

#### 3.1 Columns
- Three fixed columns: **To Do**, **In Progress**, **Complete**
- Each column displays its name and a card count badge
- Columns render their cards sorted by `order`

#### 3.2 Add Card
- An `+ Add card` button is present per column (bottom of each column) — chosen because it's more natural UX and allows direct placement
- Clicking opens an inline form (inside the column, not a modal) with:
  - Title input (required)
  - Body textarea (optional)
  - "Add" and "Cancel" buttons
- On submit: new card is appended with highest `order` in that column and saved to localStorage

#### 3.3 Card Display
- Shows title (bold) and body (muted text, truncated at 3 lines)
- Shows a column-move dropdown (select) listing the other two columns
- Shows an Edit icon and a Delete icon in the card header

#### 3.4 Edit Card
- Clicking Edit opens an inline edit form replacing the card view
- Pre-filled with existing title and body
- "Save" and "Cancel" buttons
- On save: updates card in state and localStorage

#### 3.5 Delete Card
- Clicking Delete shows a confirmation prompt (inline or browser `confirm()`)
- On confirm: removes card from state and localStorage

#### 3.6 Move Card Between Columns
- Each card has a `<select>` dropdown showing the current column and the option to switch
- On change: updates `columnId` on the card, resets `order` to end of target column, saves to localStorage

#### 3.7 Drag-and-Drop (reorder within column)
- Cards within a column are draggable
- Drop target highlights when dragging over
- On drop: `order` values are recalculated for affected column and saved to localStorage
- Drag-and-drop cross-column is NOT in scope (use dropdown instead)

#### 3.8 Persistence
- All reads on mount from localStorage
- All writes on every card mutation
- Handle missing/corrupt localStorage gracefully (fallback to empty board)

---

### 4. Component Tree
```
App
└─ KanbanBoard
   └─ Column (×3)
      ├─ ColumnHeader (title + card count)
      ├─ CardList (drag-drop container)
      │  └─ Card (×N)
      │     ├─ CardView (display mode)
      │     └─ CardForm (edit mode)
      └─ AddCardForm (inline, toggled by + Add card button)
```

---

### 5. State Management
- Single `useBoardState` custom hook owns all state
- Exposes: `cards`, `addCard`, `updateCard`, `deleteCard`, `moveCard`, `reorderCards`
- Hook handles localStorage sync internally

---

### 6. Files to Create/Modify
- `src/App.tsx` — mount KanbanBoard
- `src/App.css` — clear/replace with board layout styles
- `src/types/kanban.ts` — Card, ColumnId, Board types
- `src/hooks/useBoardState.ts` — state + localStorage logic
- `src/components/KanbanBoard.tsx`
- `src/components/Column.tsx`
- `src/components/Card.tsx`
- `src/components/CardForm.tsx`
- `src/components/AddCardForm.tsx`

---

### 7. Out of Scope
- Backend / API
- User authentication
- Card labels, due dates, assignees
- Cross-column drag-and-drop (covered by dropdown)
- Undo/redo

---

### 8. Verification
1. `npm run dev` — board renders three columns
2. Add a card to each column — cards appear and survive page refresh
3. Edit a card — changes persist
4. Delete a card — card gone after confirm
5. Move card via dropdown — appears in target column
6. Drag card within a column — reorder persists after refresh
7. `npm test` — existing tests still pass; add unit tests for `useBoardState`
