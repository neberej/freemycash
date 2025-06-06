import React, { useContext } from 'react';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import { filterDataByMonth, filterDataByYear } from '@src/utils/dateAndTime';
import { formatCurrencyParts } from '@src/utils/visual';

import Savings from '@src/components/savings/Savings';
import './Overview.scss';

const createAmountBlock = (currency: string, amount: number) => {
  const { whole, decimal } = formatCurrencyParts(currency, amount);
  return (
    <span className="amount">
      {whole}
      <span className="decimal">{decimal}</span>
    </span>
  )
}

const Overview: React.FC = () => {
  const { data, setData } = useStore();
  if (!data) return <div>{messages.overview.noData}</div>;

  const mtdExpenses = filterDataByMonth(data.transactions, 'expense') .reduce((sum, t) => sum + t.amount, 0);
  const mtdIncome = filterDataByMonth(data.transactions, 'income').reduce((sum, t) => sum + t.amount, 0);
  const ytdExpenses = filterDataByYear(data.transactions, 'expense').reduce((sum, t) => sum + t.amount, 0);
  const ytdIncome = filterDataByYear(data.transactions, 'income').reduce((sum, t) => sum + t.amount, 0);

  const { currency } = data;

  return (
    <div className="container overview">
      <h3 className="text-align-left">{messages.overview.headline}</h3>
      <div className="container-inner overview-grid">
        <div className="overview-category">
          <div className="overview-card">
            <h4 className="label">{messages.overview.mtdIncome}</h4>
            <p className="amount">{createAmountBlock(currency, mtdIncome)}</p>
          </div>
          <div className="overview-card">
            <h4 className="label">{messages.overview.mtdExpenses}</h4>
            <p className="amount">{createAmountBlock(currency, mtdExpenses)}</p>
          </div>
          <div className="overview-card">
            <h4 className="label">{messages.overview.mtdBalance}</h4>
            <p className="amount">{createAmountBlock(currency, (mtdIncome-mtdExpenses))}</p>
          </div>
        </div>
        <div className="overview-category">
          <div className="overview-card">
            <h4 className="label">{messages.overview.ytdIncome}</h4>
            <p className="amount">{createAmountBlock(currency, ytdIncome)}</p>
          </div>
          <div className="overview-card">
            <h4 className="label">{messages.overview.ytdExpenses}</h4>
            <p className="amount">{createAmountBlock(currency, ytdExpenses)}</p>
          </div>
          <div className="overview-card">
            <h4 className="label">{messages.overview.ytdBalance}</h4>
            <p className="amount">{createAmountBlock(currency, (ytdIncome-ytdExpenses))}</p>
          </div>
        </div>
      </div>
      <hr />
      <Savings />
    </div>
  );
};

export default Overview;