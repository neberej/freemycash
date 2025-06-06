
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useStore } from '@src/store/useStore';
import { useLocalStorageSync } from '@src/hooks/localStorageHook';
import { Header, WelcomeScreen, CreateNewFile, Upload, Overview, Visualize, Expenses, Income, Transactions, Settings, EditData, } from '@src/components';
import ProtectedRoutes from '@src/common/ProtectedRoutes';

import './App.scss';

// Routes for users with data
const PrivateRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.pathname} classNames="fade" timeout={250} unmountOnExit appear>
        <div className="route-container">
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/app" element={<Navigate to="/overview" replace />} />
            <Route path="/create-new" element={<CreateNewFile />} />
            <Route path="/upload" element={<Upload />} />
            <Route element={<ProtectedRoutes hasData={true} />}>
              <Route path="/overview" element={<Overview />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/income" element={<Income />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/visualize" element={<Visualize />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/data" element={<EditData />} />
            </Route>
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

// Routes for unauthenticated users
const PublicRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<WelcomeScreen />} />
    <Route path="/app" element={<WelcomeScreen />} />
    <Route path="/create-new" element={<CreateNewFile />} />
    <Route path="/upload" element={<Upload />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App: React.FC = () => {
  const { data } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useLocalStorageSync(setIsLoaded);

  if (!isLoaded) return null;
  const hasData = !!data;

  return (
    <Router>
      <div className="app">
        <Header />
        <main className={hasData ? 'main-content' : 'landing-content'}>
          {hasData ? <PrivateRoutes /> : <PublicRoutes />}
        </main>
      </div>
    </Router>
  );
};

export default App;
