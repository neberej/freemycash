import React, { useMemo, useState, useCallback } from 'react';
import { useStore } from '@src/store/useStore';
import messages from '@src/static/messages.json';
import { getCurrentMonthNumber, getCurrentYear } from '@src/utils/dateAndTime';
import { processExpenses } from '@src/utils/expenses';
import { processIncome } from '@src/utils/income';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import TrendLineChart from './TrendLineChart';
import './Visualize.scss';

const Visualize = () => {
  const { data } = useStore();
  if (!data) return <div className="visualize container">{messages.expenses.noData}</div>;

  const currentMonth = useMemo(
    () => `${getCurrentYear()}-${getCurrentMonthNumber().toString().padStart(2, '0')}`,
    []
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);

  const handleCategoryFilter = useCallback((category: string) => {
    setExcludedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  const { filteredExpenses, months: expenseMonths } = useMemo(() => {
    return processExpenses(data.transactions, selectedMonth, data.currency);
  }, [data.transactions, selectedMonth, data.currency]);

  const { filteredIncome } = useMemo(
    () => processIncome(data.transactions, selectedMonth, data.currency),
    [data.transactions, selectedMonth, data.currency]
  );

  return (
    <div className="visualize container">
      {filteredExpenses.length === 0 ? (
        <p className="no-data">{messages.expenses.noData}</p>
      ) : (
        <>
          <CategoryBreakdownChart
            data={filteredExpenses}
            currency={data.currency || 'USD'}
            months={expenseMonths}
            selectedMonth={selectedMonth}
            onCategoryClick={handleCategoryFilter}
            onMonthChange={handleMonthChange}
            excludedCategories={excludedCategories}
          />
          <TrendLineChart
            transactions={data.transactions}
            currency={data.currency || 'USD'}
            hideLegend
          />
        </>
      )}
    </div>
  );
};

export default Visualize;