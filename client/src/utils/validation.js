/**
 * Form validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password),
  };
};

/**
 * Get password strength score
 */
export const getPasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { level: 'weak', color: 'red', percent: 33 };
  if (score <= 4) return { level: 'medium', color: 'yellow', percent: 66 };
  return { level: 'strong', color: 'green', percent: 100 };
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 */
export const minLength = (value, min) => {
  return typeof value === 'string' && value.length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value, max) => {
  return typeof value === 'string' && value.length <= max;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date is in the future
 */
export const isFutureDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

/**
 * Create a form validator
 */
export const createValidator = (rules) => {
  return (values) => {
    const errors = {};
    
    Object.keys(rules).forEach((field) => {
      const fieldRules = rules[field];
      const value = values[field];
      
      for (const rule of fieldRules) {
        const error = rule(value, values);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    });
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };
};

/**
 * Common validation rules
 */
export const rules = {
  required: (message = 'This field is required') => (value) => {
    return isRequired(value) ? null : message;
  },
  
  email: (message = 'Please enter a valid email') => (value) => {
    return !value || isValidEmail(value) ? null : message;
  },
  
  minLength: (min, message) => (value) => {
    const msg = message || `Must be at least ${min} characters`;
    return !value || minLength(value, min) ? null : msg;
  },
  
  maxLength: (max, message) => (value) => {
    const msg = message || `Must be no more than ${max} characters`;
    return !value || maxLength(value, max) ? null : msg;
  },
  
  match: (field, message = 'Fields do not match') => (value, values) => {
    return value === values[field] ? null : message;
  },
  
  password: (message = 'Password is too weak') => (value) => {
    if (!value) return null;
    const result = validatePassword(value);
    return result.isValid ? null : result.errors[0] || message;
  },
  
  futureDate: (message = 'Date must be in the future') => (value) => {
    return !value || isFutureDate(value) ? null : message;
  },
  
  url: (message = 'Please enter a valid URL') => (value) => {
    return !value || isValidUrl(value) ? null : message;
  },
};

/**
 * Sanitize input - basic XSS prevention
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Trim all string values in an object
 */
export const trimFormData = (data) => {
  const trimmed = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    trimmed[key] = typeof value === 'string' ? value.trim() : value;
  });
  return trimmed;
};

export default {
  isValidEmail,
  validatePassword,
  getPasswordStrength,
  isRequired,
  minLength,
  maxLength,
  isValidUrl,
  isFutureDate,
  createValidator,
  rules,
  sanitizeInput,
  trimFormData,
};
