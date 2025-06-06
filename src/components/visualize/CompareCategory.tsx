import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '@src/types';
import { formatCurrency } from '@src/utils/savings';
import { filterTransactionsByMonth } from '@src/utils/expenses';

interface CompareCategoryProps {
  category: string;
  monthA: string;
  monthB: string;
  currency: string;
  transactions: Transaction[];
}

const CompareCategory: React.FC<CompareCategoryProps> = ({
  category,
  monthA,
  monthB,
  currency,
  transactions,
}) => {
  const sumByCategory = (month: string) =>
    filterTransactionsByMonth(transactions, month)
      .filter((t) => t.category === category && t.type === 'expense')
      .reduce((sum: number, t) => sum + t.amount, 0);

  const data = useMemo(() => {
    const a = sumByCategory(monthA);
    const b = sumByCategory(monthB);
    return {
      labels: [monthB, monthA],
      datasets: [
        {
          label: `${category} Comparison`,
          data: [b, a],
          backgroundColor: ['#aaa', '#1976d2'],
        },
      ],
    };
  }, [transactions, category, monthA, monthB]);

  return (
    <div style={{ height: 300, marginTop: 40 }}>
      <h3>{category} Spend Comparison</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw as number, currency)}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CompareCategory;
