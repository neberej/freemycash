import { DateTime } from 'luxon';
import * as DateUtils from './dateAndTime';
import { Transaction } from '@src/types';

// Only mock DateTime.now, don't overwrite the whole class
jest.spyOn(DateTime, 'now');

describe('date-utils', () => {
  const fixedDate = DateTime.fromISO('2025-06-04T15:30:00.000Z');

  beforeEach(() => {
    (DateTime.now as jest.Mock).mockReturnValue(fixedDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getCurrentDateTime returns formatted datetime string', () => {
    const result = DateUtils.getCurrentDateTime();
    expect(result).toMatch("June 4, 2025 at 8:30 AM PDT");
  });

  test('getCurrentMonth returns month name', () => {
    expect(DateUtils.getCurrentMonth()).toBe('June');
  });

  test('getCurrentMonthNumber returns correct number', () => {
    expect(DateUtils.getCurrentMonthNumber()).toBe(6);
  });

  test('getCurrentDay returns two-digit day', () => {
    expect(DateUtils.getCurrentDay()).toBe('04');
  });

  test('getCurrentDate returns formatted date string', () => {
    expect(DateUtils.getCurrentDate()).toBe('June 4, 2025');
  });

  test('getCurrentYear returns year as string', () => {
    expect(DateUtils.getCurrentYear()).toBe('2025');
  });

  test('filterDataByMonth filters by current UTC month', () => {
    const txs: Transaction[] = [
      { id: '1', type: 'expense', date: '2025-06-01', category: '', merchant: '', amount: 10 },
      { id: '2', type: 'income', date: '2025-07-01', category: '', merchant: '', amount: 10 },
    ];
    const result = DateUtils.filterDataByMonth(txs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('filterDataByYear filters by current UTC year', () => {
    const txs: Transaction[] = [
      { id: '1', type: 'expense', date: '2025-06-01', category: '', merchant: '', amount: 10 },
      { id: '2', type: 'income', date: '2024-06-01', category: '', merchant: '', amount: 10 },
    ];
    const result = DateUtils.filterDataByYear(txs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('formatMonthYear returns correct display string', () => {
    expect(DateUtils.formatMonthYear('2025-06')).toBe('6/1/2025');
  });

  test('isValidDate validates correct format', () => {
    expect(DateUtils.isValidDate('2025-06-01')).toBe(true);
    expect(DateUtils.isValidDate('2025/06/01')).toBe(false);
    expect(DateUtils.isValidDate('invalid')).toBe(false);
  });

  test('formatMonthYearDisplay returns friendly label', () => {
    expect(DateUtils.formatMonthYearDisplay('2025-06')).toBe('June 2025');
    expect(DateUtils.formatMonthYearDisplay('all')).toBe('All Months');
  });
});
