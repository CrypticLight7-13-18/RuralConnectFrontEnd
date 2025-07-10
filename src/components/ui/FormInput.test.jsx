import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import FormInput from './FormInput';

vi.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
}));

const MockIcon = () => <div data-testid="mock-icon" />;

describe('FormInput', () => {
  const defaultProps = {
    name: 'test-input',
    placeholder: 'Test input',
  };

  describe('Basic Functionality', () => {
    it('renders input with basic props', () => {
      render(<FormInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'test-input');
    });

    it('forwards ref correctly', () => {
      const ref = createRef();
      render(<FormInput {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('renders label when provided', () => {
      render(<FormInput {...defaultProps} label="Test Label" />);

      const label = screen.getByText('Test Label');
      const input = screen.getByPlaceholderText('Test input');

      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', input.getAttribute('id'));
    });

    it('renders icon when provided', () => {
      render(<FormInput {...defaultProps} icon={MockIcon} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('Password Toggle', () => {
    it('renders password toggle for password inputs', () => {
      render(
        <FormInput 
          {...defaultProps} 
          type="password" 
          onTogglePassword={vi.fn()} 
        />
      );

      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });

    it('shows/hides password based on showPassword prop', () => {
      const { rerender } = render(
        <FormInput 
          {...defaultProps} 
          type="password" 
          showPassword={false}
          onTogglePassword={vi.fn()} 
        />
      );

      let input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveAttribute('type', 'password');

      rerender(
        <FormInput 
          {...defaultProps} 
          type="password" 
          showPassword={true}
          onTogglePassword={vi.fn()} 
        />
      );

      input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('calls onTogglePassword when clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();

      render(
        <FormInput 
          {...defaultProps} 
          type="password" 
          onTogglePassword={mockToggle} 
        />
      );

      await user.click(screen.getByLabelText('Show password'));
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('displays error message and applies error styling', () => {
      render(
        <FormInput 
          {...defaultProps} 
          error="This field is required" 
        />
      );

      const errorElement = screen.getByRole('alert');
      const input = screen.getByPlaceholderText('Test input');

      expect(errorElement).toHaveTextContent('This field is required');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveClass('border-red-500');
    });

    it('does not display error when error prop is null', () => {
      render(<FormInput {...defaultProps} error={null} />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('shows asterisk for required fields with label', () => {
      render(
        <FormInput 
          {...defaultProps} 
          label="Required Field" 
          required 
        />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-red-500');
    });

    it('sets required attribute on input', () => {
      render(<FormInput {...defaultProps} required />);

      const input = screen.getByPlaceholderText('Test input');
      expect(input).toHaveAttribute('required');
    });
  });

  describe('User Interaction', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<FormInput {...defaultProps} />);

      const input = screen.getByPlaceholderText('Test input');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('handles focus and blur events', async () => {
      const user = userEvent.setup();
      const mockFocus = vi.fn();
      const mockBlur = vi.fn();

      render(
        <FormInput 
          {...defaultProps} 
          onFocus={mockFocus}
          onBlur={mockBlur}
        />
      );

      const input = screen.getByPlaceholderText('Test input');
      
      await user.click(input);
      expect(mockFocus).toHaveBeenCalled();

      await user.tab();
      expect(mockBlur).toHaveBeenCalled();
    });
  });
});