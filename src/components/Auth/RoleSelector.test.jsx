import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoleSelector from './RoleSelector';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Stethoscope: () => <div data-testid="stethoscope-icon" />,
}));

vi.mock('../../constants/Auth.constants.js', () => ({
  USER_ROLES: {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
  },
}));

describe('RoleSelector', () => {
  const mockOnRoleSelect = vi.fn();
  const defaultProps = {
    selectedRole: null,
    onRoleSelect: mockOnRoleSelect,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the role selector with legend and both role options', () => {
      render(<RoleSelector {...defaultProps} />);

      expect(screen.getByText('I am a:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /patient/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /doctor/i })).toBeInTheDocument();
    });

    it('renders role icons correctly', () => {
      render(<RoleSelector {...defaultProps} />);

      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByTestId('stethoscope-icon')).toBeInTheDocument();
    });
  });

  describe('Role Selection', () => {
    it('calls onRoleSelect when patient role is clicked', async () => {
      const user = userEvent.setup();
      render(<RoleSelector {...defaultProps} />);

      const patientButton = screen.getByRole('button', { name: /patient/i });
      await user.click(patientButton);

      expect(mockOnRoleSelect).toHaveBeenCalledWith('patient');
      expect(mockOnRoleSelect).toHaveBeenCalledTimes(1);
    });

    it('calls onRoleSelect when doctor role is clicked', async () => {
      const user = userEvent.setup();
      render(<RoleSelector {...defaultProps} />);

      const doctorButton = screen.getByRole('button', { name: /doctor/i });
      await user.click(doctorButton);

      expect(mockOnRoleSelect).toHaveBeenCalledWith('doctor');
      expect(mockOnRoleSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Selected State', () => {
    it('applies selected styling to patient when selected', () => {
      render(<RoleSelector {...defaultProps} selectedRole="patient" />);

      const patientButton = screen.getByRole('button', { name: /patient/i });
      expect(patientButton).toHaveClass('border-darkBlue', 'bg-lightestBlue', 'shadow-md');
    });

    it('applies selected styling to doctor when selected', () => {
      render(<RoleSelector {...defaultProps} selectedRole="doctor" />);

      const doctorButton = screen.getByRole('button', { name: /doctor/i });
      expect(doctorButton).toHaveClass('border-darkBlue', 'bg-lightestBlue', 'shadow-md');
    });
  });
});