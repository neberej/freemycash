import React, { useMemo, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';

import { formatCurrency } from '@src/utils/savings';
import { findTrend } from '@src/utils/trend';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import './TrendLineChart.scss';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  transactions: Transaction[];
  currency: string;
  hideLegend?: boolean;
}

const TrendLineChart: React.FC<Props> = ({ transactions, currency, hideLegend }) => {

  if (!transactions || transactions.length === 0) {
    return <div className="chart-wrapper">No data available.</div>;
  }

  const [selectedCategory, setSelectedCategory] = useState<string>(
    transactions.find(t => t.type === 'expense')?.category || 'Food'
  );

  const categories = useMemo(() => {
    const cats = new Set(
      transactions.filter(t => t.type === 'expense').map(t => t.category)
    );
    return Array.from(cats).filter(Boolean).sort();
  }, [transactions]);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    },
    []
  );

  const months = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`);
    }
    return result;
  }, []);

  const estimatedValue = findTrend(transactions, selectedCategory, months);

  const monthlyCategoryTotals = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      let month;
      try {
        month = new Date(t.date + 'T00:00:00Z').toISOString().slice(0, 7);
      } catch (err) {
        continue; // skip malformed date
      }
      if (!map.has(month)) map.set(month, new Map());
      const catMap = map.get(month)!;
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    }
    return map;
  }, [transactions]);


  const dataPoints = months.slice(0, -1).map((month) =>
    monthlyCategoryTotals.get(month)?.get(selectedCategory) || 0
  );

  const fullDataPoints = [...dataPoints, estimatedValue];

  const backgroundColor = (ctx: any) => {
    const chart = ctx.chart;
    const { ctx: context, chartArea } = chart;
    if (!chartArea) return null;
    const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(30, 98, 208, 0.4)');
    gradient.addColorStop(1, 'rgba(30, 98, 208, 0)');
    return gradient;
  };

  const chartData = {
    labels: months.map((m) => {
      const [year, monthNum] = m.split('-');
      return new Date(Number(year), Number(monthNum) - 1).toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });
    }),
    datasets: [
      {
        label: `${selectedCategory} Spend`,
        data: fullDataPoints,
        fill: true,
        backgroundColor,
        borderColor: '#1e62d0',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        segment: {
          borderDash: (ctx: any) => {
            const last = fullDataPoints.length - 1;
            return ctx.p0DataIndex === last - 1 ? [6, 6] : undefined;
          },
        },
        pointStyle: (ctx: any) => {
          const last = fullDataPoints.length - 1;
          return ctx.dataIndex === last ? 'rectRounded' : 'circle';
        },
        pointBorderWidth: (ctx: any) => {
          const last = fullDataPoints.length - 1;
          return ctx.dataIndex === last ? 2 : 0;
        },
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: '#1976d2',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          title: (ctx) => ctx[0].label,
          label: (context) =>
            `${selectedCategory}: ${formatCurrency(context.raw as number, currency)}`,
        },
      },
      legend: hideLegend ? { display: false } : {
        labels: {
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 13, weight: 'bold' },
          color: '#555',
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: { size: 13, weight: 'bold' },
          color: '#555',
        },
        grid: {
          color: '#eee',
        },
      },
    },
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="chart-wrapper trend-chart">
      <h3 className="chart-heading">Trend Over Time</h3>
      {categories.length > 0 && (
        <div className="controls">
          <label htmlFor="category-select" className="dropdown-label">
            View Trend for:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="dropdown"
            aria-label="Select category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      <p className="chart-estimate">
        Estimated for this month:{' '}
        <strong>{formatCurrency(estimatedValue, currency)}</strong>
      </p>
    </div>
  );
};

export default TrendLineChart;

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  date: string;
  merchant: string;
  category: string;
  amount: number;
}
