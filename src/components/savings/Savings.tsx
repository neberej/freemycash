import React, { useContext } from 'react';
import { useStore } from '@src/store/useStore';
import messages from '@src/static/messages.json';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from 'chart.js';
import { calculateMonthlySavings, formatCurrency } from '@src/utils/savings';
import './Savings.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const noData = () => {
  return (
    <div className="savings">
      <h3 className="text-align-left">{messages.overview.savings}</h3>
      {messages.overview.noData}
    </div>
  );
};

const Savings: React.FC = () => {
  const { data } = useStore();

  if (!data || data.transactions.length === 0) return noData();

  const { labels, savings } = calculateMonthlySavings(data.transactions, data.currency);

  // Calculate monthly income and expenses for tooltip
  const monthlyData = data.transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      acc[monthYear].expenses += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Savings',
        data: savings,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Monthly Savings History' },
      tooltip: {
        callbacks: {
          label: function () {
            return ''; // Suppress default label
          },
          afterBody: function (context: TooltipItem<'line'>[]) {
            const index = context[0].dataIndex;
            const monthYear = labels[index];
            const savingsValue = savings[index];
            const income = monthlyData[monthYear]?.income || 0;
            const expenses = monthlyData[monthYear]?.expenses || 0;

            return [
              `Income: ${formatCurrency(income, data.currency)}`,
              `Expenses: ${formatCurrency(expenses, data.currency)}`,
              `Savings: ${formatCurrency(savingsValue, data.currency)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        ticks: {
          callback: function (tickValue: string | number) {
            return formatCurrency(
              typeof tickValue === 'number' ? tickValue : parseFloat(tickValue),
              data.currency
            );
          },
        },
      },
    },
  };

  return (
    <div className="savings">
      <h3 className="text-align-left">{messages.overview.savings}</h3>
      <div className="savings-chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Savings;