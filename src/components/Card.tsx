import { useState } from 'react';
import type { Card, ColumnId } from '../types/kanban';
import { COLUMNS } from '../types/kanban';
import { CardForm } from './CardForm';

interface CardProps {
  card: Card;
  index: number;
  onUpdate: (id: string, title: string, body: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, targetColumnId: ColumnId) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  isDragOver: boolean;
}

export function Card({
  card,
  index,
  onUpdate,
  onDelete,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: CardProps) {
  const [editing, setEditing] = useState(false);

  const otherColumns = COLUMNS.filter((col) => col.id !== card.columnId);

  function handleDelete() {
    if (window.confirm('Delete this card?')) {
      onDelete(card.id);
    }
  }

  function handleMoveChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onMove(card.id, e.target.value as ColumnId);
  }

  if (editing) {
    return (
      <div className={`card${isDragOver ? ' card--drag-over' : ''}`}>
        <CardForm
          initialTitle={card.title}
          initialBody={card.body}
          submitLabel="Save"
          onSubmit={(title, body) => {
            onUpdate(card.id, title, body);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`card${isDragOver ? ' card--drag-over' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
    >
      <div className="card__header">
        <span className="card__title">{card.title}</span>
        <div className="card__actions">
          <button
            className="card__icon-btn"
            onClick={() => setEditing(true)}
            aria-label="Edit card"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="card__icon-btn card__icon-btn--delete"
            onClick={handleDelete}
            aria-label="Delete card"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {card.body && <p className="card__body">{card.body}</p>}

      <div className="card__footer">
        <select
          className="card__move-select"
          value={card.columnId}
          onChange={handleMoveChange}
          aria-label="Move to column"
        >
          <option value={card.columnId} disabled>
            Move to…
          </option>
          {otherColumns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
