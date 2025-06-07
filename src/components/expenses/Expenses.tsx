import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@src/store/useStore';
import messages from '@src/static/messages.json';
import { processExpenses, formatDate } from '@src/utils/expenses';
import { formatCurrency } from '@src/utils/savings';
import { getCurrentMonthNumber, getCurrentYear, formatMonthYearDisplay } from '@src/utils/dateAndTime';
import { ExpenseGroup } from '@src/types';
import './Expenses.scss';

const Expenses: React.FC = () => {
  const { data } = useStore();
  const currentMonth = useMemo(
    () => `${getCurrentYear()}-${getCurrentMonthNumber().toString().padStart(2, '0')}`, // e.g., "2025-06"
    []
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Current month may not have data
  useEffect(() => {
    const allMonths = new Set(data?.transactions.map(t => t.date.slice(0, 7)));
    if (!allMonths.has(selectedMonth)) {
      // Pick current month if available, else pick latest
      const sorted = Array.from(allMonths).sort((a, b) => b.localeCompare(a));
      const fallback = sorted.includes(currentMonth) ? currentMonth : sorted[0];
      if (fallback) setSelectedMonth(fallback);
    }
  }, [data?.transactions]);

  // Input validation
  if (!data || !data.transactions || !Array.isArray(data.transactions)) {
    return <div>{messages.expenses.noData}</div>;
  }

  // Memoize processing for large datasets
  const { filteredExpenses, months } = useMemo(
    () =>
      processExpenses(data.transactions, selectedMonth, data.currency) as {
        filteredExpenses: ExpenseGroup[];
        months: string[];
      },
    [data.transactions, selectedMonth, data.currency]
  );

  // Sort months in descending order (most recent first)
  const sortedMonths = useMemo(() => {
    const sorted = [...months].sort((a, b) => b.localeCompare(a));
    return sorted;
  }, [months]);

  // Debounce month selection for performance with large datasets
  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  }, []);

  // Handle category jump
  const handleCategoryJump = useCallback((category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="container expenses">
      <h3>{messages.expenses.title}</h3>
      <label htmlFor="month-select" className="dropdown-label">
        Select Month:
      </label>
      <select
        className="dropdown"
        value={selectedMonth}
        onChange={handleMonthChange}
        aria-label="Select month for expenses"
      >
        {sortedMonths.map((month) => (
          <option key={month} value={month}>
            {formatMonthYearDisplay(month)}
          </option>
        ))}
        <option value="all">{messages.expenses.allMonths}</option>
      </select>
      {filteredExpenses.length === 0 ? (
        <div className="no-data">
          <p>{messages.expenses.noData}</p>
        </div>
      ) : (
        <div className="expenses-content">
          <div className="category-jump-links">
            <p className="jump-label">Jump to a category:</p>
            {filteredExpenses.map(({ category }) => (
              <button
                key={category}
                className="category-jump-link"
                onClick={() => handleCategoryJump(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="expenses-list">
            {filteredExpenses.map(({ category, transactions, total }) => (
              <div
                key={category}
                className="category-group"
                ref={(el) => (categoryRefs.current[category] = el)}
              >
                <h4>{category}</h4>
                {transactions.map((t) => (
                  <div key={t.id || `${t.date}-${t.amount}-${t.merchant}`} className="transaction-item">
                    <span>{formatDate(t.date)}</span>
                    <span>{t.merchant}</span>
                    <span>{formatCurrency(t.amount, data.currency) || `${t.amount} ${data.currency || 'USD'}`}</span>
                  </div>
                ))}
                <p className="category-total">
                  Total: {formatCurrency(total, data.currency) || `${total} ${data.currency || 'USD'}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;