import { formatCurrencyParts } from './visual';

describe('formatCurrencyParts', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrencyParts('$', 1234.56)).toEqual({
      whole: '$1,234',
      decimal: '.56',
    });
  });

  it('formats negative numbers with - before currency symbol', () => {
    expect(formatCurrencyParts('$', -9876.54)).toEqual({
      whole: '-$9,876',
      decimal: '.54',
    });
  });

  it('formats zero correctly', () => {
    expect(formatCurrencyParts('$', 0)).toEqual({
      whole: '$0',
      decimal: '.00',
    });
  });

  it('formats rounding correctly', () => {
    expect(formatCurrencyParts('$', 1.5)).toEqual({
      whole: '$1',
      decimal: '.50',
    });
  });
});
