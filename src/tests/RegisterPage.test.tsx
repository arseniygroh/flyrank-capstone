import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RegisterPage from '@/app/register/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

global.fetch = vi.fn();

describe('RegisterPage Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays an error message when the server returns a 400 validation error', async () => {
    const user = userEvent.setup();
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Email is already taken" }),
    });

    render(<RegisterPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    const submitButton = screen.getByRole('button', { name: /Sign up/i });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'taken@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    await user.click(submitButton);

    const errorMessage = await screen.findByText("Email is already taken");
    expect(errorMessage).toBeInTheDocument();
  });
});