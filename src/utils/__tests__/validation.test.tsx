import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validatePhone, sanitizeInput, RateLimiter } from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('admin@healthcare-org.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts valid passwords', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects passwords that are too short', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long');
    });

    it('accepts minimum length passwords', () => {
      const result = validatePassword('123456');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+1 (240) 599-0102')).toBe(true);
      expect(validatePhone('240-599-0102')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc-def-ghij')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace and removes dangerous characters', () => {
      expect(sanitizeInput('  normal text  ')).toBe('normal text');
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('safe > content < here')).toBe('safe  content  here');
    });
  });

  describe('RateLimiter', () => {
    it('allows attempts within the limit', () => {
      const limiter = new RateLimiter();
      expect(limiter.canAttempt('test-key', 3, 60000)).toBe(true);
      expect(limiter.canAttempt('test-key', 3, 60000)).toBe(true);
      expect(limiter.canAttempt('test-key', 3, 60000)).toBe(true);
    });

    it('blocks attempts exceeding the limit', () => {
      const limiter = new RateLimiter();
      // Use up the attempts
      for (let i = 0; i < 3; i++) {
        limiter.canAttempt('test-key-2', 3, 60000);
      }
      expect(limiter.canAttempt('test-key-2', 3, 60000)).toBe(false);
    });
  });
});