import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import messages from '@src/static/messages.json';
import ClearData from '@src/components/clear-data/ClearData';
import Download from '@src/components/download/Download';
import { useStore } from '@src/store/useStore';
import { FiSettings } from "react-icons/fi";
import './Header.scss';

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = () => {
  const { data, isDemo } = useStore();
  return (
    <header className="header">
      <NavLink className="tab logo" to={data ? '/overview' : '/'}>
        <span className={`logo-bill ${isDemo && 'demo'}`}></span>
      </NavLink>
      {data && <nav>
        <NavLink className="tab" to="/overview">{messages.overview.title}</NavLink>
        <NavLink className="tab" to="/expenses">{messages.expenses.title}</NavLink>
        <NavLink className="tab" to="/income">{messages.income.title}</NavLink>
        <NavLink className="tab" to="/transactions">{messages.transactions.title}</NavLink>
        <NavLink className="tab" to="/visualize">{messages.visualize.title}</NavLink>
        <NavLink className="tab" to="/data">{messages.editData.title}</NavLink>
      </nav>}
      {data && <div className="header-actions">
        <NavLink className="button" to="/settings">
          <FiSettings />
          <span className="visually-hidden">{messages.settings.title}</span>
        </NavLink>
        <Download />
        <ClearData />
      </div>}
    </header>
  );
};

export default Header;