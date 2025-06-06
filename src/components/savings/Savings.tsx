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
import { calculateMonthlySavings, formatCurrency, formatCurrencyShort } from '@src/utils/savings';
import './Savings.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const noData = () => {
  return (
    <div className="no-data">
      <p>{messages.expenses.noData}</p>
    </div>
  );
};

const Savings: React.FC = () => {
  const { data } = useStore();

  if (!data || data.transactions.length === 0) return noData();

  const { labels: rawLabels, savings: rawSavings } = calculateMonthlySavings(data.transactions, data.currency);

  // Remove last month (current incomplete month)
  const labels = rawLabels.slice(0, -1);
  const savings = rawSavings.slice(0, -1);

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
        borderColor: '#1E90FF',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#1E90FF',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
              enabled: false,
              external: function (context: any) {
                const { chart, tooltip } = context;
                let tooltipEl = document.getElementById('chartjs-tooltip');
                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.classList.add('savings-tooltip');
                  chart.canvas.parentNode.appendChild(tooltipEl);
                }
                if (tooltip.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
                }
      
                const index = tooltip.dataPoints?.[0]?.dataIndex ?? 0;
                const label = labels[index];
                const income = monthlyData[label]?.income || 0;
                const expenses = monthlyData[label]?.expenses || 0;
                const saving = savings[index] || 0;
      
                tooltipEl.innerHTML = `
                  <div class="tooltip-title">${label}</div>
                  <div class='tooltip-item tooltip-income'>
                    <span>Income:</span>
                    <span>${formatCurrency(income, data.currency)}</span>
                  </div>
                  <div class='tooltip-item tooltip-expenses'>
                    <span>Expenses:</span>
                    <span>${formatCurrency(expenses, data.currency)}</span>
                  </div>
                  <div class="savings-separator"></div>
                  <div class='tooltip-item tooltip-savings'>
                    <span>Savings:</span>
                    <span>${formatCurrency(saving, data.currency)}</span>
                  </div>
                `;

                const { offsetLeft: posX, offsetTop: posY } = chart.canvas;
                tooltipEl.style.opacity = '1';
                tooltipEl.style.left = posX + tooltip.caretX + 'px';
                tooltipEl.style.top = posY + tooltip.caretY + 'px';
              },
            },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          color: '#333',
          maxTicksLimit: 6,
        },
      },
      y: {
        type: 'linear' as const,
        grid: { display: false },
        min: 1000,
        ticks: {
          stepSize: 1000,
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