import { COLUMNS } from '../types/kanban';
import { useBoardState } from '../hooks/useBoardState';
import { Column } from './Column';

export function KanbanBoard() {
  const { cards, addCard, updateCard, deleteCard, moveCard, reorderCards } =
    useBoardState();

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          label={col.label}
          cards={cards.filter((c) => c.columnId === col.id)}
          onAddCard={addCard}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
          onMoveCard={moveCard}
          onReorderCards={reorderCards}
        />
      ))}
    </div>
  );
}
