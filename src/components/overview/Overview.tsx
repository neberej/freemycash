import React, { useContext } from 'react';
import messages from '@src/static/messages.json';
import { useStore } from '@src/store/useStore';
import { getCurrentMonthNumber, getCurrentYear, filterDataByMonth, filterDataByYear } from '@src/utils/dateAndTime';
import Savings from '@src/components/savings/Savings';
import './Overview.scss';

const Overview: React.FC = () => {
  const { data, setData } = useStore();
  if (!data) return <div>{messages.overview.noData}</div>;

  const mtdExpenses = filterDataByMonth(data.transactions, 'expense') .reduce((sum, t) => sum + t.amount, 0);
  const mtdIncome = filterDataByMonth(data.transactions, 'income').reduce((sum, t) => sum + t.amount, 0);
  const ytdExpenses = filterDataByYear(data.transactions, 'expense').reduce((sum, t) => sum + t.amount, 0);
  const ytdIncome = filterDataByYear(data.transactions, 'income').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container overview">
      <h3 className="text-align-left">{messages.overview.headline}</h3>
      <div className="container-inner overview-grid">
        <div className="overview-category">
          <div className="overview-card">
            <h4>{messages.overview.mtdExpenses}</h4>
            <p>{data.currency}{mtdExpenses.toFixed(2)}</p>
          </div>
          <div className="overview-card">
            <h4>{messages.overview.mtdIncome}</h4>
            <p>{data.currency}{mtdIncome.toFixed(2)}</p>
          </div>
          <div className="overview-card">
            <h4>{messages.overview.mtdBalance}</h4>
            <p>{data.currency}{(mtdIncome - mtdExpenses).toFixed(2)}</p>
          </div>
        </div>
        <div className="overview-category">
          <div className="overview-card">
            <h4>{messages.overview.ytdExpenses}</h4>
            <p>{data.currency}{ytdExpenses.toFixed(2)}</p>
          </div>
          <div className="overview-card">
            <h4>{messages.overview.ytdIncome}</h4>
            <p>{data.currency}{ytdIncome.toFixed(2)}</p>
          </div>
          <div className="overview-card">
            <h4>{messages.overview.ytdBalance}</h4>
            <p>{data.currency}{(ytdIncome - ytdExpenses).toFixed(2)}</p>
          </div>
        </div>
      </div>
      <hr />
      <Savings />
    </div>
  );
};

export default Overview;