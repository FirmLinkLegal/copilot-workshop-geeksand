import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

// ─── helpers ──────────────────────────────────────────────────────────────────

function getColumn(name: RegExp | string) {
  // columns are identified by their heading
  const heading = screen.getByRole('heading', { name });
  return heading.closest('.column') as HTMLElement;
}

async function addCard(columnName: RegExp | string, title: string, body = '') {
  const col = getColumn(columnName);
  await userEvent.click(within(col).getByRole('button', { name: /\+ add card/i }));
  await userEvent.type(within(col).getByPlaceholderText(/card title/i), title);
  if (body) await userEvent.type(within(col).getByPlaceholderText(/description/i), body);
  await userEvent.click(within(col).getByRole('button', { name: /^add$/i }));
}

// ─── board renders ────────────────────────────────────────────────────────────

describe('Board layout', () => {
  beforeEach(() => render(<App />));

  it('renders all three column headings', () => {
    expect(screen.getByRole('heading', { name: /to do/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /complete/i })).toBeInTheDocument();
  });

  it('renders an "+ Add card" button in each column', () => {
    const buttons = screen.getAllByRole('button', { name: /\+ add card/i });
    expect(buttons).toHaveLength(3);
  });
});

// ─── add card ─────────────────────────────────────────────────────────────────

describe('Adding a card', () => {
  beforeEach(() => render(<App />));

  it('adds a card to the correct column', async () => {
    await addCard(/to do/i, 'My first task');
    const col = getColumn(/to do/i);
    expect(within(col).getByText('My first task')).toBeInTheDocument();
  });

  it('shows an optional body when provided', async () => {
    await addCard(/in progress/i, 'Task with body', 'Some description here');
    expect(screen.getByText('Some description here')).toBeInTheDocument();
  });

  it('does not add a card when title is empty', async () => {
    const col = getColumn(/to do/i);
    await userEvent.click(within(col).getByRole('button', { name: /\+ add card/i }));
    await userEvent.click(within(col).getByRole('button', { name: /^add$/i }));
    // form stays open, no card title in column
    expect(within(col).queryAllByText(/card title/i)).toHaveLength(0);
  });

  it('increments the column badge count', async () => {
    const col = getColumn(/to do/i);
    expect(within(col).getByText('0')).toBeInTheDocument();
    await addCard(/to do/i, 'Badge test');
    expect(within(col).getByText('1')).toBeInTheDocument();
  });

  it('cancelling the form hides it', async () => {
    const col = getColumn(/to do/i);
    await userEvent.click(within(col).getByRole('button', { name: /\+ add card/i }));
    expect(within(col).getByPlaceholderText(/card title/i)).toBeInTheDocument();
    await userEvent.click(within(col).getByRole('button', { name: /cancel/i }));
    expect(within(col).queryByPlaceholderText(/card title/i)).not.toBeInTheDocument();
  });
});

// ─── edit card ────────────────────────────────────────────────────────────────

describe('Editing a card', () => {
  beforeEach(async () => {
    render(<App />);
    await addCard(/to do/i, 'Original title', 'Original body');
  });

  it('pre-fills the edit form with existing content', async () => {
    await userEvent.click(screen.getByRole('button', { name: /edit card/i }));
    expect(screen.getByDisplayValue('Original title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original body')).toBeInTheDocument();
  });

  it('updates the card after saving', async () => {
    await userEvent.click(screen.getByRole('button', { name: /edit card/i }));
    const titleInput = screen.getByDisplayValue('Original title');
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated title');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText('Updated title')).toBeInTheDocument();
    expect(screen.queryByText('Original title')).not.toBeInTheDocument();
  });

  it('cancelling edit preserves original content', async () => {
    await userEvent.click(screen.getByRole('button', { name: /edit card/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByText('Original title')).toBeInTheDocument();
  });
});

// ─── delete card ──────────────────────────────────────────────────────────────

describe('Deleting a card', () => {
  beforeEach(async () => {
    render(<App />);
    await addCard(/to do/i, 'To be deleted');
  });

  it('removes the card after confirming deletion', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await userEvent.click(screen.getByRole('button', { name: /delete card/i }));
    expect(screen.queryByText('To be deleted')).not.toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('keeps the card when deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await userEvent.click(screen.getByRole('button', { name: /delete card/i }));
    expect(screen.getByText('To be deleted')).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});

// ─── move card ────────────────────────────────────────────────────────────────

describe('Moving a card between columns', () => {
  beforeEach(async () => {
    render(<App />);
    await addCard(/to do/i, 'Moveable card');
  });

  it('moves the card to the selected column', async () => {
    const select = screen.getByRole('combobox', { name: /move to column/i });
    await userEvent.selectOptions(select, 'in-progress');

    const inProgressCol = getColumn(/in progress/i);
    const todoCol = getColumn(/to do/i);

    expect(within(inProgressCol).getByText('Moveable card')).toBeInTheDocument();
    expect(within(todoCol).queryByText('Moveable card')).not.toBeInTheDocument();
  });

  it('updates the column badge counts after move', async () => {
    const select = screen.getByRole('combobox', { name: /move to column/i });
    await userEvent.selectOptions(select, 'complete');

    expect(within(getColumn(/to do/i)).getByText('0')).toBeInTheDocument();
    expect(within(getColumn(/complete/i)).getByText('1')).toBeInTheDocument();
  });
});

// ─── localStorage persistence ─────────────────────────────────────────────────

describe('localStorage persistence', () => {
  it('persists cards across remounts', async () => {
    const { unmount } = render(<App />);
    await addCard(/to do/i, 'Persisted card');
    unmount();

    render(<App />);
    expect(screen.getByText('Persisted card')).toBeInTheDocument();
  });

  it('starts with an empty board when localStorage is empty', () => {
    render(<App />);
    const badges = screen.getAllByText('0');
    expect(badges).toHaveLength(3);
  });
});
