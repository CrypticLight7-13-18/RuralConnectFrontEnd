/**
 * Secure Input Component with built-in validation and sanitization
 */

import React, { useState, useEffect } from 'react';
import { sanitizeInput, isValidEmail } from '../../utils/security';

const SecureInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  maxLength,
  minLength,
  required = false,
  validation,
  name,
  autoComplete = 'off',
  ...props
}) => {
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  // Validate input based on type and custom validation
  const validateInput = (inputValue) => {
    if (required && (!inputValue || inputValue.trim().length === 0)) {
      return 'This field is required';
    }

    if (minLength && inputValue.length < minLength) {
      return `Minimum length is ${minLength} characters`;
    }

    if (maxLength && inputValue.length > maxLength) {
      return `Maximum length is ${maxLength} characters`;
    }

    if (type === 'email' && inputValue && !isValidEmail(inputValue)) {
      return 'Please enter a valid email address';
    }

    // Custom validation function
    if (validation && typeof validation === 'function') {
      const customError = validation(inputValue);
      if (customError) {
        return customError;
      }
    }

    return '';
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // Sanitize input for security
    inputValue = sanitizeInput(inputValue);
    
    // Validate
    const validationError = validateInput(inputValue);
    setError(validationError);
    
    // Call parent onChange
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: inputValue,
          name: name,
          isValid: !validationError
        }
      });
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleFocus = () => {
    setError('');
  };

  // Validate on value change
  useEffect(() => {
    if (value) {
      let validationError = '';
      
      if (required && (!value || value.trim().length === 0)) {
        validationError = 'This field is required';
      } else if (minLength && value.length < minLength) {
        validationError = `Minimum length is ${minLength} characters`;
      } else if (maxLength && value.length > maxLength) {
        validationError = `Maximum length is ${maxLength} characters`;
      } else if (type === 'email' && value && !isValidEmail(value)) {
        validationError = 'Please enter a valid email address';
      } else if (validation && typeof validation === 'function') {
        const customError = validation(value);
        if (customError) {
          validationError = customError;
        }
      }
      
      setError(validationError);
    }
  }, [value, required, minLength, maxLength, type, validation]);

  const inputClasses = `
    ${className || ''}
    ${error && isTouched ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
    ${error && isTouched ? 'bg-red-50' : 'bg-white'}
  `.trim();

  return (
    <div className="w-full">
      <input
        type={type}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={inputClasses}
        maxLength={maxLength}
        name={name}
        autoComplete={autoComplete}
        {...props}
      />
      {error && isTouched && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SecureInput;
