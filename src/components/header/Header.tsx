import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import messages from '@src/static/messages.json';
import ClearData from '@src/components/clear-data/ClearData';
import Download from '@src/components/download/Download';
import { useStore } from '@src/store/useStore';
import { FiSettings } from "react-icons/fi";
import './Header.scss';

const Header: React.FC = () => {
  const { data, setData } = useStore();
  return (
    <header className="header">
      <Link className="tab logo" to={data ? '/overview' : '/'}>
        <span className="logo-bill"></span>
      </Link>
      {data && <nav>
        <Link className="tab" to="/overview">{messages.overview.title}</Link>
        <Link className="tab" to="/expenses">{messages.expenses.title}</Link>
        <Link className="tab" to="/income">{messages.income.title}</Link>
        <Link className="tab" to="/transactions">{messages.transactions.title}</Link>
        <Link className="tab" to="/edit-data">{messages.editData.title}</Link>
      </nav>}
      <div className="header-actions">
        <Link className="button" to="/settings">
          <FiSettings />
          <span className="visually-hidden">{messages.settings.title}</span>
        </Link>
        <Download />
        <ClearData />
      </div>
    </header>
  );
};

export default Header;