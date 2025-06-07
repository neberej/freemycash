import React, { useContext, useState, useCallback, useMemo, useRef } from 'react';
import { useStore } from '@src/store/useStore';
import messages from '@src/static/messages.json';
import { processIncome, formatDate } from '@src/utils/income';
import { formatCurrency } from '@src/utils/savings';
import { getCurrentMonthNumber, getCurrentYear, formatMonthYearDisplay } from '@src/utils/dateAndTime';
import { FinancialData, ExpenseGroup } from '@src/types';
import './Income.scss';

const Income: React.FC = () => {
  const { data } = useStore();
  const currentMonth = useMemo(
    () => `${getCurrentYear()}-${getCurrentMonthNumber().toString().padStart(2, '0')}`, // e.g., "2025-06"
    []
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Input validation
  if (!data || !data.transactions || !Array.isArray(data.transactions)) {
    return <div>{messages.income.noData}</div>;
  }

  // Memoize processing for large datasets
  const { filteredIncome, months } = useMemo(
    () =>
      processIncome(data.transactions, selectedMonth, data.currency) as {
        filteredIncome: ExpenseGroup[];
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
    <div className="income container">
      <h3>{messages.income.title}</h3>
      <label htmlFor="month-select" className="dropdown-label">
        Select Month:
      </label>
      <select
        className="dropdown"
        value={selectedMonth}
        onChange={handleMonthChange}
        aria-label="Select month for income"
      >
        {sortedMonths.map((month) => (
          <option key={month} value={month}>
            {formatMonthYearDisplay(month)}
          </option>
        ))}
        <option value="all">{messages.income.allMonths}</option>
      </select>
      {filteredIncome.length === 0 ? (
        <div className="no-data">
          <p>{messages.income.noData}</p>
        </div>
      ) : (
        <div className="income-content">
          <div className="income-list">
            {filteredIncome.map(({ category, transactions, total }) => (
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
                <p className="income-total">
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

export default Income;