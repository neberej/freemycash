import React, { useCallback, useMemo, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { ExpenseGroup } from '@src/types';
import { formatCurrency } from '@src/utils/savings';
import { formatMonthYearDisplay } from '@src/utils/dateAndTime';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import './CategoryBreakdownChart.scss';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  data: ExpenseGroup[];
  currency: string;
  months: string[];
  selectedMonth: string;
  onCategoryClick?: (category: string) => void;
  onMonthChange?: (month: string) => void;
  disableInteraction?: boolean;
  excludedCategories?: string[];
}

const predefinedColors = [
  '#4e9af1', '#1e62d0', '#74c69d', '#ffb703', '#fb8500', '#8ecae6',
  '#ff6b6b', '#9b5de5', '#00bbf9', '#ffd6a5', '#caffbf', '#bdb2ff'
];

const CategoryBreakdownChart: React.FC<Props> = ({
  data,
  currency,
  months,
  selectedMonth,
  onCategoryClick,
  onMonthChange,
  disableInteraction = false,
  excludedCategories = [],
}) => {
  const prevLabelsLength = useRef<number>(0);

  const allCategories = useMemo(() => {
    return Array.from(
      new Set(data.map((d) => d.category).concat(excludedCategories))
    ).filter(Boolean).sort();
  }, [data, excludedCategories]);

  const filteredCategories = useMemo(() => {
    return allCategories.filter(
      (cat) => !excludedCategories.includes(cat)
    );
  }, [allCategories, excludedCategories]);

  const labels = filteredCategories;

  const values = useMemo(() => {
    return labels.map(
      (label) => data.find((d) => d.category === label)?.total || 0
    );
  }, [labels, data]);

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Total Spent',
        data: values,
        backgroundColor: labels.map((_, i) => predefinedColors[i % predefinedColors.length]),
        borderColor: '#ffffff',
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  }), [labels, values]);

  const shouldAnimate = useMemo(() => {
    const animate = labels.length >= prevLabelsLength.current;
    prevLabelsLength.current = labels.length;
    return animate;
  }, [labels]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: '#2a2a2a',
        titleFont: { size: 16, weight: 'bold', family: 'Arial' },
        bodyFont: { size: 14, family: 'Arial' },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (ctx) => ctx[0].label,
          label: (context) => `${formatCurrency(context.raw as number, currency)}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { font: { size: 14, family: 'Arial' }, color: '#333' },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: 14, family: 'Arial' }, color: '#333' },
       grid: { display: false },
      },
    },
    onClick: disableInteraction
      ? undefined
      : (e, elements) => {
          if (!onCategoryClick || elements.length === 0) return;
          const index = elements[0].index;
          if (index >= 0 && index < labels.length) {
            const category = labels[index];
            onCategoryClick(category);
          }
        },
    animation: shouldAnimate
      ? {
          duration: 700,
          easing: 'easeOutQuart',
        }
      : false,
  };

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onMonthChange?.(e.target.value);
    },
    [onMonthChange]
  );

  if (!data || data.length === 0) {
    return <div className="chart-wrapper">No spending data available.</div>;
  }

  return (
    <div className="chart-wrapper category-chart">
      <h3 className="chart-heading">Spending by Category</h3>
      {allCategories.length > 0 && (
        <>
          <div className="controls">
            <label htmlFor="month-select" className="dropdown-label">
              Select Month:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="dropdown"
              aria-label="Select month"
              disabled={disableInteraction}
            >
              <option value="all">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatMonthYearDisplay(month)}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
      <div className="legend-container">
        <span className="legend-label">Click to exclude:</span>
        <div className="legend-items">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`legend-btn ${excludedCategories.includes(cat) ? 'excluded' : ''}`}
              onClick={() => onCategoryClick?.(cat)}
              disabled={disableInteraction}
            >
              {excludedCategories.includes(cat) ? <s>{cat}</s> : cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;
