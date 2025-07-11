/**
 * React Security Hooks and Higher-Order Components
 * Provides security utilities for React components
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { sanitizeUserInput, ClientRateLimit } from '../utils/security';

/**
 * Hook for secure input handling with debouncing
 * @param {string} initialValue - Initial input value
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @param {function} validator - Custom validation function
 * @returns {object} Input state and handlers
 */
export const useSecureInput = (initialValue = '', debounceMs = 300, validator = null) => {
  const [value, setValue] = useState(initialValue);
  const [sanitizedValue, setSanitizedValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const debounceRef = useRef(null);

  const validateAndSanitize = useCallback((inputValue) => {
    // Sanitize input
    const sanitized = sanitizeUserInput(inputValue);
    setSanitizedValue(sanitized);

    // Validate
    let validationError = '';
    if (validator && typeof validator === 'function') {
      validationError = validator(sanitized);
    }

    setError(validationError);
    setIsValid(!validationError);

    return { sanitized, error: validationError, isValid: !validationError };
  }, [validator]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce validation
    debounceRef.current = setTimeout(() => {
      validateAndSanitize(newValue);
    }, debounceMs);
  }, [debounceMs, validateAndSanitize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    value,
    sanitizedValue,
    error,
    isValid,
    handleChange,
    validate: () => validateAndSanitize(value)
  };
};

/**
 * Hook for rate limiting user actions
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} Rate limiting functions
 */
export const useRateLimit = (maxAttempts = 5, windowMs = 60000) => {
  const rateLimitRef = useRef(new ClientRateLimit(maxAttempts, windowMs));

  const checkLimit = useCallback((key) => {
    return rateLimitRef.current.isAllowed(key);
  }, []);

  const resetLimit = useCallback((key) => {
    rateLimitRef.current.reset(key);
  }, []);

  return { checkLimit, resetLimit };
};

/**
 * Hook for secure API calls with automatic retry and rate limiting
 * @param {function} apiFunction - API function to call
 * @param {object} options - Configuration options
 * @returns {object} API call state and trigger function
 */
export const useSecureApiCall = (apiFunction, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    rateLimitKey = 'api-call',
    onSuccess,
    onError
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { checkLimit } = useRateLimit();
  const retryCountRef = useRef(0);

  const execute = useCallback(async (...args) => {
    // Check rate limit
    if (!checkLimit(rateLimitKey)) {
      const rateLimitError = new Error('Rate limit exceeded. Please try again later.');
      setError(rateLimitError);
      if (onError) onError(rateLimitError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      retryCountRef.current = 0;
      
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      console.error('API call failed:', err);
      
      // Retry logic for network errors
      if (retryCountRef.current < maxRetries && err.code === 'NETWORK_ERROR') {
        retryCountRef.current++;
        setTimeout(() => {
          execute(...args);
        }, retryDelay * retryCountRef.current);
        return;
      }

      setError(err);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, checkLimit, rateLimitKey, maxRetries, retryDelay, onSuccess, onError]);

  return {
    loading,
    error,
    data,
    execute
  };
};

/**
 * Higher-Order Component for adding security features to components
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {object} securityOptions - Security configuration
 * @returns {React.Component} Enhanced component with security features
 */
export const withSecurity = (WrappedComponent, securityOptions = {}) => {
  const {
    sanitizeProps = true,
    rateLimitActions = false,
    logSecurityEvents = true
  } = securityOptions;

  return function SecurityEnhancedComponent(props) {
    const { checkLimit } = useRateLimit();

    // Sanitize props if enabled
    const sanitizedProps = sanitizeProps 
      ? Object.keys(props).reduce((acc, key) => {
          const value = props[key];
          acc[key] = typeof value === 'string' ? sanitizeUserInput(value) : value;
          return acc;
        }, {})
      : props;

    // Add security methods to props
    const securityProps = {
      ...sanitizedProps,
      security: {
        sanitizeInput: sanitizeUserInput,
        checkRateLimit: rateLimitActions ? checkLimit : () => true,
        logEvent: logSecurityEvents ? console.log : () => {}
      }
    };

    return <WrappedComponent {...securityProps} />;
  };
};

export default {
  useSecureInput,
  useRateLimit,
  useSecureApiCall,
  withSecurity
};
