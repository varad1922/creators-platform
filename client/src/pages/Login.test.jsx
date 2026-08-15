import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock API service
jest.mock('../services/api', () => ({
  post: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: {} }),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Return mock context value
    useAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      user: null
    });
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 1. Using getByRole for semantic heading
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    
    // 2. Using getByLabelText for form inputs
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    // 3. Using getByRole for the submit button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors when the form is submitted empty', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // 4. Using getByText to find error messages
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('updates input values when the user types', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Verifying value updates
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
