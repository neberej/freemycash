import React, { useState } from 'react';
import { Transaction, FinancialData } from '@src/types';
import Overlay from '@src/components/overlay/Overlay';
import { useStore } from '@src/store/useStore';
import { parseCsvToTransactions } from '@src/utils/csv';
import { saveToLocalStorage } from '@src/utils/saveData';
import Notification from '@src/components/notification/Notification';
import { Notification as NotificationType } from '@src/types';
import { generateTransactionId, updateTransaction } from '@src/utils/transactions';
import messages from '@src/static/messages.json';
import './CsvData.scss';

const CsvData: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [parsedTransactions, setParsedTransactions] = useState<Transaction[]>([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const addNotification = (message: string, type: NotificationType['type']) => {
      setNotifications([...notifications, { id: Date.now().toString(), message, type }]);
  };

  // Extracted function: handle CSV file upload and parsing
  const handleUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const { transactions } = parseCsvToTransactions(text, file.name);
        setParsedTransactions(transactions.map((t: any) => ({ ...t })));
        setIsOverlayOpen(true);
      } catch (error) {
        console.error('CSV parse error:', error);
      }
    };
    reader.readAsText(file);
  };

  // Extracted function: render the editable transactions table
  const renderTransactionsTable = () => {
    if (parsedTransactions.length === 0) {
      return <p>No transactions loaded.</p>;
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Merchant</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {parsedTransactions.map((tx, i) => (
            <tr key={tx.id}>
              <td>
                <input type="date" id="date" className="input" value={tx.date.slice(0, 10)} onChange={(e) => updateTransactionField(i, 'date', e.target.value)} />
              </td>
              <td>
                <select value={tx.type} className="dropdown" onChange={(e) => updateTransactionField(i, 'type', e.target.value)} >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </td>
              <td>
                <input type="text" className="input" value={tx.category} onChange={(e) => updateTransactionField(i, 'category', e.target.value)} />
              </td>
              <td>
                <input type="text" className="input" value={tx.merchant} onChange={(e) => updateTransactionField(i, 'merchant', e.target.value)} />
              </td>
              <td>
                <input type="number" step="0.01" className="input amount" min="0" value={tx.amount} onChange={(e) => updateTransactionField(i, 'amount', Number(e.target.value) || 0) } />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Edit handler remains in main scope to update state
  const updateTransactionField = (
    index: number,
    field: keyof Omit<Transaction, 'id'>,
    value: string | number
  ) => {
    setParsedTransactions((txs) =>
      txs.map((tx, i) => (i === index ? { ...tx, [field]: value } : tx))
    );
  };

  // On AddToData just close overlay and log for now
  const handleAddToData = () => {
    const { data, setData } = useStore.getState();

    if (!data) {
      console.error('No financial data in store');
      return;
    }

    const validTransactions: Transaction[] = [];
    const failed: Transaction[] = [];

    for (const raw of parsedTransactions) {
      try {
        // Basic validation
        if (
          !['income', 'expense'].includes(raw.type) ||
          !raw.date ||
          isNaN(new Date(raw.date).getTime()) ||
          typeof raw.amount !== 'number' ||
          raw.amount < 0 ||
          !raw.merchant ||
          (raw.type === 'expense' && !raw.category)
        ) {
          addNotification(`Failed to import transactions.`, 'error');
          throw new Error('Invalid transaction format');
        }

        validTransactions.push({
          ...raw,
          id: generateTransactionId(),
          date: raw.date.slice(0, 10), // normalize to YYYY-MM-DD
        });
      } catch (e) {
        failed.push(raw);
        console.warn('Invalid transaction skipped:', raw, (e as Error).message);
      }
    }

    // Merge all at once
    const updatedData: FinancialData = {
      ...data,
      transactions: [...data.transactions, ...validTransactions],
    };

    // Try setting to local storage
    if (data.saveInBrowser) saveToLocalStorage(updatedData);

    setData(updatedData);
    setIsOverlayOpen(false);

    if (failed.length > 0) {
      alert(`Skipped ${failed.length} invalid transaction(s).`);
    }
    addNotification(`Successfully imported ${validTransactions.length} transactions.`, 'success');
  };

  return (
    <div className="csv-upload-container">
      <h4>{messages.editData.uploadTitle}</h4>
      <p>{messages.editData.uploadDesc}</p>
      <input type="file" accept=".csv" onChange={(e) => handleUpload(e.target.files?.[0] ?? null)} />
      <Overlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)}>
        <h3>{messages.csvData.parsedTitle}</h3>
       <div className="table-wrapper">{renderTransactionsTable()}</div>
       <div className="add-data-actions">
          <button className="button" onClick={handleAddToData}>{messages.csvData.save}</button>
          <button className="button dark" onClick={() => setIsOverlayOpen(false)}>{messages.csvData.cancel}</button>
        </div>
      </Overlay>
      {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() =>
              setNotifications(notifications.filter((n) => n.id !== notification.id))
            }
          />
        ))}
    </div>
  );
};

export default CsvData;
