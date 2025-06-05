import React from "react";
import "./Tabs.scss";

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="tabs" role="tablist">
      <button
        className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
        onClick={() => onTabChange("overview")}
        role="tab"
        aria-selected={activeTab === "overview"}
        aria-controls="overview-panel"
      >
        Overview
      </button>
      <button
        className={`tab ${activeTab === "expenses" ? "tab-active" : ""}`}
        onClick={() => onTabChange("expenses")}
        role="tab"
        aria-selected={activeTab === "expenses"}
        aria-controls="expenses-panel"
      >
        Expenses
      </button>
      <button
        className={`tab ${activeTab === "income" ? "tab-active" : ""}`}
        onClick={() => onTabChange("income")}
        role="tab"
        aria-selected={activeTab === "income"}
        aria-controls="income-panel"
      >
        Income
      </button>
      <button
        className={`tab ${activeTab === "transactions" ? "tab-active" : ""}`}
        onClick={() => onTabChange("transactions")}
        role="tab"
        aria-selected={activeTab === "transactions"}
        aria-controls="transactions-panel"
      >
        Transactions
      </button>
      <button
        className={`tab ${activeTab === "editData" ? "tab-active" : ""}`}
        onClick={() => onTabChange("editData")}
        role="tab"
        aria-selected={activeTab === "editData"}
        aria-controls="editData-panel"
      >
        Edit Data
      </button>
    </nav>
  );
};

export default Tabs;