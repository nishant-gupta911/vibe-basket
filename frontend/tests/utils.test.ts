/**
 * FRONTEND TESTS: Utility Functions
 * Tests for frontend utility functions
 */

import { cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (classNames merger)', () => {
    test('should merge class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    test('should handle conditional classes', () => {
      const result = cn('class1', false && 'class2', 'class3');
      expect(result).toContain('class1');
      expect(result).not.toContain('class2');
      expect(result).toContain('class3');
    });

    test('should handle undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });
});

describe('Token Manager', () => {
  test('should exist and be importable', () => {
    const { tokenManager } = require('@/lib/api');
    expect(tokenManager).toBeDefined();
    expect(typeof tokenManager.getAccessToken).toBe('function');
    expect(typeof tokenManager.setTokens).toBe('function');
    expect(typeof tokenManager.clearTokens).toBe('function');
  });
});
