import { DateTime } from 'luxon';
import { Transaction } from '@src/types';

// Default to en-US if navigator.language is unavailable
export const getLocale = (): string => {
  return navigator.language || 'en-US';
};

// Get user's timezone, falling back to 'America/Los_Angeles'
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles';
};

// Returns the current date and time in a formatted string (e.g., "June 3, 2025 11:44 PM PDT")
export const getCurrentDateTime = (): string => {
  try {
    const dt = DateTime.now().setZone(getUserTimezone());
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.toLocaleString({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }, { locale: getLocale() }).replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error formatting date and time:', error);
    throw error;
  }
};

// Returns the current month as a full name (e.g., "June")
export const getCurrentMonth = (): string => {
  try {
    const dt = DateTime.now().setZone(getUserTimezone());
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.toLocaleString({ month: 'long' }, { locale: getLocale() });
  } catch (error) {
    console.error('Error formatting month:', error);
    throw error;
  }
};

// Returns the current month as a number (1-12, e.g., 6 for June)
export const getCurrentMonthNumber = (): number => {
  try {
    const dt = DateTime.now().setZone(getUserTimezone());
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.month;
  } catch (error) {
    console.error('Error getting month number:', error);
    throw error;
  }
};

// Returns the current day of the month as a two-digit string (e.g., "03")
export const getCurrentDay = (): string => {
  try {
    const dt = DateTime.now().setZone(getUserTimezone());
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.toFormat('dd');
  } catch (error) {
    console.error('Error formatting day:', error);
    throw error;
  }
};

// Returns the current date in a formatted string (e.g., "June 3, 2025")
export const getCurrentDate = (): string => {
  try {
    const dt = DateTime.now().setZone(getUserTimezone());
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.toLocaleString({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }, { locale: getLocale() }).replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error formatting date:', error);
    throw error;
  }
};

// Returns the current year as a string (e.g., "2025")
export const getCurrentYear = (): string => {
  try {
    const dt = DateTime.now().setZone(getUserTimezone());
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.toFormat('yyyy');
  } catch (error) {
    console.error('Error formatting year:', error);
    throw error;
  }
};

// Returns the current date in ISO format (e.g., "2025-06-04") in UTC
export const getCurrentDateISO = (): string => {
  try {
    const dt = DateTime.utc();
    if (!dt.isValid) {
      throw new Error('Invalid date');
    }
    return dt.toFormat('yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date to ISO:', error);
    throw error;
  }
};

// Filters transactions by the current month (e.g., June 2025) in UTC
export const filterDataByMonth = (transactions: Transaction[], type?: 'income' | 'expense'): Transaction[] => {
  if (!Array.isArray(transactions)) {
    throw new Error('Transaction must be an array');
  }
  const currentMonth = DateTime.utc().month;
  return transactions.filter((t) => {
    const dt = DateTime.fromFormat(t.date, 'yyyy-MM-dd', { zone: 'utc' });
    if (!dt.isValid) {
      console.warn(`Invalid date for transaction ${t.id || 'unknown'}: ${t.date}`);
      return false;
    }
    const isCorrectType = !type || t.type === type;
    return isCorrectType && dt.month === currentMonth;
  });
};

// Filters transactions by the current year (e.g., 2025) in UTC
export const filterDataByYear = (transactions: Transaction[], type?: 'income' | 'expense'): Transaction[] => {
  if (!Array.isArray(transactions)) {
    throw new Error('Transaction must be an array');
  }
  const currentYear = DateTime.utc().year;
  return transactions.filter((t) => {
    const dt = DateTime.fromFormat(t.date, 'yyyy-MM-dd', { zone: 'utc' });
    if (!dt.isValid) {
      console.warn(`Invalid date for transaction ${t.id || 'unknown'}: ${t.date}`);
      return false;
    }
    const isCorrectType = !type || t.type === type;
    return isCorrectType && dt.year === currentYear;
  });
};

// Formats a month string (e.g., "2025-06") into a locale-aware string (e.g., "6/1/2025") in UTC
export const formatMonthYear = (month: string): string => {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    throw new Error('Invalid month format; expected YYYY-MM');
  }
  const dt = DateTime.fromFormat(month, 'yyyy-MM', { zone: 'utc' });
  if (!dt.isValid) {
    throw new Error(`Invalid date: ${month}`);
  }
  return dt.toLocaleString({ month: 'numeric', day: 'numeric', year: 'numeric' }, { locale: getLocale() });
};

// Validates a date string (e.g., "2025-06-01") in UTC
export const isValidDate = (date: string): boolean => {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return false;
    }
    const dt = DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: 'utc' });
    return dt.isValid && dt.toFormat('yyyy-MM-dd') === date;
  } catch {
    return false;
  }
};

// Formats a month string (e.g., "2025-06") into a display-friendly string (e.g., "June 2025") in UTC
export const formatMonthYearDisplay = (month: string): string => {
  if (month === 'all') return 'All Months';
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    throw new Error('Invalid month format; expected YYYY-MM');
  }
  const dt = DateTime.fromFormat(month, 'yyyy-MM', { zone: 'utc' });
  if (!dt.isValid) {
    throw new Error(`Invalid date: ${month}`);
  }
  return dt.toLocaleString({ month: 'long', year: 'numeric' }, { locale: getLocale() });
};

export const toLocalDateInput = (date: string): string => {
  const dt = DateTime.fromISO(date, { zone: 'utc' }).setZone(getUserTimezone());
  return dt.toFormat('yyyy-MM-dd');
};


export const fromLocalDateInput = (date: string): string => {
  const dt = DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: getUserTimezone() }).toUTC();
  return dt.toFormat('yyyy-MM-dd');
};