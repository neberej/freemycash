import React, { useContext, useState, useCallback, useMemo } from 'react';
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

  // Debounce month selection for performance with large datasets
  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  }, []);

  return (
    <div className="income container">
      <h2>{messages.income.title}</h2>
      <select
        className="dropdown"
        value={selectedMonth}
        onChange={handleMonthChange}
        aria-label="Select month for income"
      >
        <option value="all">{messages.income.allMonths}</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {formatMonthYearDisplay(month)}
          </option>
        ))}
      </select>
      {filteredIncome.length === 0 ? (
        <div className="no-data">
          <p>{messages.income.noData}</p>
        </div>
      ) : (
        <div className="income-content">
          <div className="income-list">
            {filteredIncome.map(({ category, transactions, total }) => (
              <div key={category} className="category-group">
                <h3>{category}</h3>
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