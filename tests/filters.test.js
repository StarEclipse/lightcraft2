import { describe, it, expect } from 'vitest';
import { currency, date } from '../src/methods/filters';

describe('filters', () => {
  it('formats currency correctly', () => {
    expect(currency(12345)).toBe('12,345');
  });

  it('converts timestamps to localized dates', () => {
    const ts = 1640995200; // 2022-01-01 UTC
    expect(date(ts)).toBe(new Date(ts * 1000).toLocaleDateString());
  });
});
