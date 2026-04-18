import { useEffect, useState } from 'react';
import type { Card, ColumnId } from '../types/kanban';

const STORAGE_KEY = 'kanban-board';

function loadCards(): Card[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Card[];
    return [];
  } catch {
    return [];
  }
}

function maxOrder(cards: Card[], columnId: ColumnId): number {
  const col = cards.filter((c) => c.columnId === columnId);
  if (col.length === 0) return -1;
  return Math.max(...col.map((c) => c.order));
}

export function useBoardState() {
  const [cards, setCards] = useState<Card[]>(loadCards);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  function addCard(columnId: ColumnId, title: string, body: string) {
    const newCard: Card = {
      id: crypto.randomUUID(),
      title,
      body,
      columnId,
      order: maxOrder(cards, columnId) + 1,
      createdAt: Date.now(),
    };
    setCards((prev) => [...prev, newCard]);
  }

  function updateCard(id: string, title: string, body: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, body } : c)),
    );
  }

  function deleteCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function moveCard(id: string, targetColumnId: ColumnId) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, columnId: targetColumnId, order: maxOrder(prev, targetColumnId) + 1 }
          : c,
      ),
    );
  }

  function reorderCards(columnId: ColumnId, fromIndex: number, toIndex: number) {
    setCards((prev) => {
      const colCards = prev
        .filter((c) => c.columnId === columnId)
        .sort((a, b) => a.order - b.order);
      const rest = prev.filter((c) => c.columnId !== columnId);

      const [moved] = colCards.splice(fromIndex, 1);
      colCards.splice(toIndex, 0, moved);

      const updated = colCards.map((c, i) => ({ ...c, order: i }));
      return [...rest, ...updated];
    });
  }

  return { cards, addCard, updateCard, deleteCard, moveCard, reorderCards };
}
