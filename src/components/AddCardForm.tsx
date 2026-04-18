import { useState } from 'react';
import { CardForm } from './CardForm';

interface AddCardFormProps {
  onAdd: (title: string, body: string) => void;
}

export function AddCardForm({ onAdd }: AddCardFormProps) {
  const [open, setOpen] = useState(false);

  function handleSubmit(title: string, body: string) {
    onAdd(title, body);
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-card-btn" onClick={() => setOpen(true)}>
        + Add card
      </button>
    );
  }

  return (
    <CardForm
      submitLabel="Add"
      onSubmit={handleSubmit}
      onCancel={() => setOpen(false)}
    />
  );
}
