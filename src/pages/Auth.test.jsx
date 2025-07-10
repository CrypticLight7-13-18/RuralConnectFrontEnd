import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Auth from './Auth';

vi.mock('../hooks/useAuthForm', () => ({
  useAuthForm: vi.fn(),
}));

vi.mock('../components/ui/FormInput', () => ({
  default: vi.fn(({ error, placeholder, type = 'text', icon: Icon, ...props }, ref) => (
    <div>
      {Icon && <Icon data-testid={`${placeholder}-icon`} />}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        data-testid={`input-${placeholder}`}
        {...props}
      />
      {error && <span role="alert" data-testid={`error-${placeholder}`}>{error}</span>}
    </div>
  )),
}));

vi.mock('../components/Auth/RoleSelector', () => ({
  default: ({ selectedRole, onRoleSelect, error }) => (
    <div data-testid="role-selector">
      <button
        type="button"
        onClick={() => onRoleSelect('patient')}
        data-testid="role-patient"
        aria-pressed={selectedRole === 'patient'}
      >
        Patient
      </button>
      <button
        type="button"
        onClick={() => onRoleSelect('doctor')}
        data-testid="role-doctor"
        aria-pressed={selectedRole === 'doctor'}
      >
        Doctor
      </button>
      {error && <span role="alert" data-testid="role-error">{error}</span>}
    </div>
  ),
}));

vi.mock('../constants/Auth.constants', () => ({
  ANIMATION_CONFIG: {
    SMOOTH: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);



describe('Auth Component', () => {
  const mockUseAuthForm = {
    isLogin: true,
    showPassword: false,
    showConfirmPassword: false,
    isSubmitting: false,
    errors: {},
    register: vi.fn((name) => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    })),
    handleSubmit: vi.fn((fn) => (e) => {
      e.preventDefault();
      fn();
    }),
    watch: vi.fn((field) => {
      if (field === 'role') return 'patient';
      return '';
    }),
    toggleMode: vi.fn(),
    togglePasswordVisibility: vi.fn(),
    toggleConfirmPasswordVisibility: vi.fn(),
    handleRoleSelect: vi.fn(),
  };

  beforeEach(async() => {
    vi.clearAllMocks();
    const { useAuthForm } = await import('../hooks/useAuthForm');
    useAuthForm.mockReturnValue(mockUseAuthForm);
    
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the mode toggle buttons', () => {
      render(<Auth />, { wrapper: TestWrapper });

      const loginTab = screen.getByRole('tab', { name: /login/i });
      const signupTab = screen.getByRole('tab', { name: /sign up/i });

      expect(loginTab).toBeInTheDocument();
      expect(signupTab).toBeInTheDocument();
      expect(loginTab).toHaveAttribute('aria-selected', 'true');
      expect(signupTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Login Mode', () => {
    it('renders login form fields', () => {
      render(<Auth />, { wrapper: TestWrapper });

      expect(screen.getByTestId('input-Email Address')).toBeInTheDocument();
      expect(screen.getByTestId('input-Password')).toBeInTheDocument();
      expect(screen.getByTestId('role-selector')).toBeInTheDocument();
    });

    it('does not render signup form fields', ()=>{
      render (<Auth/>, {wrapper: TestWrapper});

      expect(screen.queryByTestId('input-Full Name')).not.toBeInTheDocument();
      expect(screen.queryByTestId('input-Date of Birth')).not.toBeInTheDocument();
      expect(screen.queryByTestId('input-Confirm Password')).not.toBeInTheDocument();
    })

    it('renders submit button with correct text for login', () => {
      render(<Auth />, { wrapper: TestWrapper });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).not.toBeDisabled();
    });

    it('renders role selector in login mode', () => {
      render(<Auth />, { wrapper: TestWrapper });

      expect(screen.getByTestId('role-selector')).toBeInTheDocument();
      expect(screen.getByTestId('role-patient')).toBeInTheDocument();
      expect(screen.getByTestId('role-doctor')).toBeInTheDocument();
    });

    it('renders mode switch link for login', () => {
      render(<Auth />, { wrapper: TestWrapper });

      const switchLink = screen.getByText("Don't have an account? Sign up");
      expect(switchLink).toBeInTheDocument();
      expect(switchLink).toHaveAttribute('type', 'button');
    });
  });

  describe('Signup Mode', () => {
    beforeEach(async() => {
      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isLogin: false,
      });
    });

    it('renders signup form fields', () => {
      render(<Auth />, { wrapper: TestWrapper });

      expect(screen.getByTestId('input-Full Name')).toBeInTheDocument();
      expect(screen.getByTestId('input-Email Address')).toBeInTheDocument();
      expect(screen.getByTestId('input-Password')).toBeInTheDocument();
      expect(screen.getByTestId('input-Date of Birth')).toBeInTheDocument();
      expect(screen.getByTestId('input-Confirm Password')).toBeInTheDocument();
      
      expect(screen.queryByTestId('role-selector')).not.toBeInTheDocument();
    });

    it('renders submit button with correct text for signup', () => {
      render(<Auth />, { wrapper: TestWrapper });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders mode switch link for signup', () => {
      render(<Auth />, { wrapper: TestWrapper });

      const switchLink = screen.getByText("Already have an account? Sign in");
      expect(switchLink).toBeInTheDocument();
    });

    it('renders tab states correctly for signup mode', () => {
      render(<Auth />, { wrapper: TestWrapper });

      const loginTab = screen.getByRole('tab', { name: /login/i });
      const signupTab = screen.getByRole('tab', { name: /sign up/i });

      expect(loginTab).toHaveAttribute('aria-selected', 'false');
      expect(signupTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Form Interactions', () => {
    it('calls handleSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((fn) => (e) => {
        e.preventDefault();
        fn();
      });

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        handleSubmit: mockHandleSubmit,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('calls toggleMode when mode toggle buttons are clicked', async () => {
      const user = userEvent.setup();
      const mockToggleMode = vi.fn();

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        toggleMode: mockToggleMode,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const signupTab = screen.getByRole('tab', { name: /sign up/i });
      await user.click(signupTab);

      expect(mockToggleMode).toHaveBeenCalled();
    });

    it('calls toggleMode when mode switch link is clicked', async () => {
      const user = userEvent.setup();
      const mockToggleMode = vi.fn();

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        toggleMode: mockToggleMode,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const switchLink = screen.getByText("Don't have an account? Sign up");
      await user.click(switchLink);

      expect(mockToggleMode).toHaveBeenCalled();
    });

    it('calls handleRoleSelect when role is selected', async () => {
      const user = userEvent.setup();
      const mockHandleRoleSelect = vi.fn();

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        handleRoleSelect: mockHandleRoleSelect,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const doctorRole = screen.getByTestId('role-doctor');
      await user.click(doctorRole);

      expect(mockHandleRoleSelect).toHaveBeenCalledWith('doctor');
    });
  });

  describe('Form Validation and Errors', () => {
    it('displays form errors when present', async() => {
      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        errors: {
          email: { message: 'Email is required' },
          password: { message: 'Password is required' },
          role: { message: 'Please select your role' },
        },
      });

      render(<Auth />, { wrapper: TestWrapper });

      expect(screen.getByTestId('error-Email Address')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('error-Password')).toHaveTextContent('Password is required');
      expect(screen.getByTestId('role-error')).toHaveTextContent('Please select your role');
    });

    it('displays signup-specific errors', async() => {
      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isLogin: false,
        errors: {
          userName: { message: 'Name is required' },
          dateOfBirth: { message: 'Date of birth is required' },
          confirmPassword: { message: 'Passwords do not match' },
        },
      });

      render(<Auth />, { wrapper: TestWrapper });

      expect(screen.getByTestId('error-Full Name')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('error-Date of Birth')).toHaveTextContent('Date of birth is required');
      expect(screen.getByTestId('error-Confirm Password')).toHaveTextContent('Passwords do not match');
    });
  });

  describe('Loading States', () => {
    it('displays loading state when signing in', async() => {
      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isSubmitting: true,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const submitButton = screen.getByRole('button', { name: /signing in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Signing In...');
    });

    it('displays loading state for signup', async() => {
      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isLogin: false,
        isSubmitting: true,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const submitButton = screen.getByRole('button', { name: /creating account/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Creating Account...');
    });

    it('disables mode switch link when submitting', async() => {
      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isSubmitting: true,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const switchLink = screen.getByText("Don't have an account? Sign up");
      expect(switchLink).toBeDisabled();
    });
  });

  describe('Form Field Registration', () => {
    it('registers form fields with correct names for login', async() => {
      const mockRegister = vi.fn((name) => ({
        name,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      }));

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        register: mockRegister,
      });

      render(<Auth />, { wrapper: TestWrapper });

      expect(mockRegister).toHaveBeenCalledWith('email');
      expect(mockRegister).toHaveBeenCalledWith('password');
    });

    it('registers signup fields when in signup mode', async() => {
      const mockRegister = vi.fn((name) => ({
        name,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      }));

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isLogin: false,
        register: mockRegister,
      });

      render(<Auth />, { wrapper: TestWrapper });

      expect(mockRegister).toHaveBeenCalledWith('userName');
      expect(mockRegister).toHaveBeenCalledWith('dateOfBirth');
      expect(mockRegister).toHaveBeenCalledWith('confirmPassword');
    });
  });

  describe('Mode Toggle Behavior', () => {
    it('prevents toggle when already in login mode', async () => {
      const user = userEvent.setup();
      const mockToggleMode = vi.fn();

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        toggleMode: mockToggleMode,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const loginTab = screen.getByRole('tab', { name: /login/i });
      await user.click(loginTab);

      // Should not call toggleMode when already in login mode
      expect(mockToggleMode).not.toHaveBeenCalled();
    });

    it('prevents toggle when already in signup mode', async () => {
      const user = userEvent.setup();
      const mockToggleMode = vi.fn();

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        isLogin: false,
        toggleMode: mockToggleMode,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const signupTab = screen.getByRole('tab', { name: /sign up/i });
      await user.click(signupTab);

      // Should not call toggleMode when already in signup mode
      expect(mockToggleMode).not.toHaveBeenCalled();
    });
  });

  describe('Password Visibility', () => {
    it('calls toggle password visibility for main password field', async () => {
      const user = userEvent.setup();
      const mockTogglePassword = vi.fn();

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        togglePasswordVisibility: mockTogglePassword,
      });

      // Mock FormInput to include toggle button
      vi.mocked(await import('../components/ui/FormInput')).default.mockImplementation(
        vi.fn(({ onTogglePassword, placeholder, ...props }, ref) => (
          <div>
            <input ref={ref} placeholder={placeholder} {...props} />
            {onTogglePassword && (
              <button 
                type="button" 
                onClick={onTogglePassword}
                data-testid={`toggle-${placeholder}`}
              >
                Toggle
              </button>
            )}
          </div>
        ))
      );

      render(<Auth />, { wrapper: TestWrapper });

      const toggleButton = screen.getByTestId('toggle-Password');
      await user.click(toggleButton);

      expect(mockTogglePassword).toHaveBeenCalled();
    });
  });

  describe('Form Submit with Different Methods', () => {
    it('submits form using fireEvent', async () => {
      const mockHandleSubmit = vi.fn((fn) => (e) => {
        e.preventDefault();
        fn();
      });

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        handleSubmit: mockHandleSubmit,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('submits form by pressing Enter on input field', async () => {
      const user = userEvent.setup();
      const mockHandleSubmit = vi.fn((fn) => (e) => {
        e.preventDefault();
        fn();
      });

      const { useAuthForm } = await import('../hooks/useAuthForm');
      useAuthForm.mockReturnValue({
        ...mockUseAuthForm,
        handleSubmit: mockHandleSubmit,
      });

      render(<Auth />, { wrapper: TestWrapper });

      const emailInput = screen.getByTestId('input-Email Address');
      await user.type(emailInput, 'test@example.com');
      await user.keyboard('{Enter}');

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});