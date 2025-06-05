import React, { createContext, useState, useEffect } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useStore } from '@src/store/useStore';
import { useLocalStorageSync } from '@src/hooks/localStorageHook';
import Header from '@src/components/header/Header';
import WelcomeScreen from '@src/components/welcome-screen/WelcomeScreen';
import Overview from '@src/components/overview/Overview';
import Expenses from '@src/components/expenses/Expenses';
import Income from '@src/components/income/Income';
import Transactions from '@src/components/transactions/Transactions';
import Settings from '@src/components/settings/Settings';
import Upload from '@src/components/upload/Upload';
import EditData from '@src/components/edit-data/EditData';
import CreateNewFile from '@src/components/create-new-file/CreateNewFile';
import { FinancialData } from '@src/types';
import ProtectedRoutes from '@src/common/ProtectedRoutes';
import './App.scss';

export const DataContext = createContext<{
  data: FinancialData | null;
  setData: (data: FinancialData | null) => void;
  isModified: boolean;
  setIsModified: (value: boolean) => void;
}>({
  data: null,
  setData: () => {},
  isModified: false,
  setIsModified: () => {},
});

// Props interface for AnimatedRoutes
interface AnimatedRoutesProps {
  hasData: boolean;
}

// Functional component to wrap Routes with transition
const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ hasData }) => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={250}
        unmountOnExit
      >
        <div className="route-container">
          <Routes location={location}>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="*" element={<Navigate to={hasData ? '/overview' : '/'} replace />} />
            <Route path="/create-new" element={<CreateNewFile />} />
            <Route element={<ProtectedRoutes hasData={hasData} />}>
              <Route path="/overview" element={<Overview />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/income" element={<Income />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/edit-data" element={<EditData />} />
            </Route>
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App: React.FC = () => {
  const { data, setData } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useLocalStorageSync(setIsLoaded);

  if (!isLoaded) {
    return null; // Avoid rendering until data is checked
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <AnimatedRoutes hasData={!!data} />
        </main>
      </div>
    </Router>
  );
};

export default App;