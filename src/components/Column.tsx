import { useState } from 'react';
import type { Card as CardType, ColumnId } from '../types/kanban';
import { Card } from './Card';
import { AddCardForm } from './AddCardForm';

interface ColumnProps {
  id: ColumnId;
  label: string;
  cards: CardType[];
  onAddCard: (columnId: ColumnId, title: string, body: string) => void;
  onUpdateCard: (id: string, title: string, body: string) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (id: string, targetColumnId: ColumnId) => void;
  onReorderCards: (columnId: ColumnId, fromIndex: number, toIndex: number) => void;
}

export function Column({
  id,
  label,
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  onReorderCards,
}: ColumnProps) {
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const sorted = [...cards].sort((a, b) => a.order - b.order);

  function handleDragStart(index: number) {
    setDragFromIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(toIndex: number) {
    if (dragFromIndex !== null && dragFromIndex !== toIndex) {
      onReorderCards(id, dragFromIndex, toIndex);
    }
    setDragFromIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragFromIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="column" onDragEnd={handleDragEnd}>
      <div className="column__header">
        <h2 className="column__title">{label}</h2>
        <span className="column__badge">{cards.length}</span>
      </div>

      <div className="column__cards">
        {sorted.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
            onMove={onMoveCard}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragOver={dragOverIndex === index}
          />
        ))}
      </div>

      <AddCardForm onAdd={(title, body) => onAddCard(id, title, body)} />
    </div>
  );
}
