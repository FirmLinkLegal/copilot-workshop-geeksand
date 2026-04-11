import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument();
  });

  it('increments the counter when clicked', async () => {
    const button = screen.getByRole('button', { name: /count is/i });
    expect(button).toHaveTextContent('Count is 0');
    await userEvent.click(button);
    expect(button).toHaveTextContent('Count is 1');
  });
});
