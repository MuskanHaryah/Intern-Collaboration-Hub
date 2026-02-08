import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  validatePassword,
  getPasswordStrength,
  isRequired,
  minLength,
  maxLength,
  isValidUrl,
  isFutureDate,
} from '../utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('SecurePass123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require minimum length', () => {
      const result = validatePassword('Short1');
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should require uppercase letter', () => {
      const result = validatePassword('lowercase123');
      expect(result.errors).toContain('Password must contain an uppercase letter');
    });

    it('should require lowercase letter', () => {
      const result = validatePassword('UPPERCASE123');
      expect(result.errors).toContain('Password must contain a lowercase letter');
    });

    it('should require number', () => {
      const result = validatePassword('NoNumbers');
      expect(result.errors).toContain('Password must contain a number');
    });
  });

  describe('getPasswordStrength', () => {
    it('should classify weak passwords', () => {
      const result = getPasswordStrength('pass');
      expect(result.level).toBe('weak');
      expect(result.color).toBe('red');
      expect(result.percent).toBe(33);
    });

    it('should classify medium passwords', () => {
      const result = getPasswordStrength('Password1');
      expect(result.level).toBe('medium');
      expect(result.color).toBe('yellow');
      expect(result.percent).toBe(66);
    });

    it('should classify strong passwords', () => {
      const result = getPasswordStrength('SecurePass123!@#');
      expect(result.level).toBe('strong');
      expect(result.color).toBe('green');
      expect(result.percent).toBe(100);
    });
  });

  describe('isRequired', () => {
    it('should validate non-empty strings', () => {
      expect(isRequired('text')).toBe(true);
      expect(isRequired('  text  ')).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });

    it('should validate non-empty arrays', () => {
      expect(isRequired([1, 2, 3])).toBe(true);
      expect(isRequired(['item'])).toBe(true);
    });

    it('should reject empty arrays', () => {
      expect(isRequired([])).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should validate strings meeting minimum length', () => {
      expect(minLength('hello', 5)).toBe(true);
      expect(minLength('hello world', 5)).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      expect(minLength('hi', 5)).toBe(false);
      expect(minLength('test', 5)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should validate strings within maximum length', () => {
      expect(maxLength('hello', 10)).toBe(true);
      expect(maxLength('test', 5)).toBe(true);
    });

    it('should reject strings exceeding maximum length', () => {
      expect(maxLength('this is too long', 10)).toBe(false);
      expect(maxLength('hello world', 5)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://api.example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('isFutureDate', () => {
    it('should validate future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isFutureDate(tomorrow)).toBe(true);
    });

    it('should validate today as future date', () => {
      const today = new Date();
      expect(isFutureDate(today)).toBe(true);
    });

    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isFutureDate(yesterday)).toBe(false);
    });
  });
});
