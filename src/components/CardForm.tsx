import { useState } from 'react';

interface CardFormProps {
  initialTitle?: string;
  initialBody?: string;
  submitLabel?: string;
  onSubmit: (title: string, body: string) => void;
  onCancel: () => void;
}

export function CardForm({
  initialTitle = '',
  initialBody = '',
  submitLabel = 'Add',
  onSubmit,
  onCancel,
}: CardFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed, body.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="card-form">
      <input
        className="card-form__input"
        type="text"
        placeholder="Card title (required)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        required
      />
      <textarea
        className="card-form__textarea"
        placeholder="Description (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
      />
      <div className="card-form__actions">
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
