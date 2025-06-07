import React, { useContext, useState } from 'react';
import { useStore } from '@src/store/useStore';
import messages from '@src/static/messages.json';
import { Transaction } from '@src/types';
import { createNewTransaction, updateTransaction, deleteTransaction } from '@src/utils/transactions';
import { formatCurrency } from '@src/utils/savings';
import { formatDate } from '@src/utils/expenses';
import EditTransaction from '@src/components/edit-transaction/EditTransaction';
import ConfirmDelete from '@src/components/confirm-delete/ConfirmDelete';
import ReactPaginate from 'react-paginate';
import './Transactions.scss';

const Transactions: React.FC = () => {
  const { data, setData, setIsModified, syncToApi } = useStore();
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const sortedTransactions = React.useMemo(() => {
  if (!data) return [];

  return [...data.transactions].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;

    // Compare only the timestamp portion of the ID (before the 2nd hyphen)
    const aId = a.id.split('-').slice(0, 2).join('-'); // "t-1717799811350"
    const bId = b.id.split('-').slice(0, 2).join('-');

    return bId.localeCompare(aId); // Newer first
  });
}, [data]);

  const currentTransactions = sortedTransactions.slice(offset, offset + itemsPerPage);
  const pageCount = data ? Math.ceil(sortedTransactions.length / itemsPerPage) : 0;

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  if (!data) return <div>{messages.transactions.noData}</div>;

  const handleAddTransaction = (type: 'income' | 'expense' = 'expense') => {
    const newTransaction = createNewTransaction(type, data.categories);
    setEditTransaction(newTransaction);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleSaveTransaction = async(updatedTransaction: Transaction) => {
    try {
      const updatedData = updateTransaction(data, updatedTransaction, data.saveInBrowser);
      setData(updatedData);
      setIsModified(true);
      setIsDialogOpen(false);
      setEditTransaction(null);
      await syncToApi();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleConfirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteTransaction = async() => {
    if (confirmDeleteId) {
      try {
        const updatedData = deleteTransaction(data, confirmDeleteId, data.saveInBrowser);
        setData(updatedData);
        setIsModified(true);
        setConfirmDeleteId(null);
        await syncToApi();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div className="container transactions">
      <h2>{messages.transactions.title}</h2>
      <div className="container-inner transaction-actions">
        <button className="button" onClick={() => handleAddTransaction('expense')}>
          {messages.transactions.addExpense}
        </button>
        <button className="button" onClick={() => handleAddTransaction('income')}>
          {messages.transactions.addIncome}
        </button>
      </div>
      {data.transactions.length === 0 ? (
        <p>{messages.transactions.noData}</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>{messages.transactions.headers.date}</th>
                <th>{messages.transactions.headers.type}</th>
                <th>{messages.transactions.headers.merchant}</th>
                <th>{messages.transactions.headers.category}</th>
                <th>{messages.transactions.headers.amount}</th>
                <th>{messages.transactions.headers.actions}</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.merchant}</td>
                  <td>{transaction.category || '-'}</td>
                  <td>{formatCurrency(transaction.amount, data.currency)}</td>
                  <td>
                    <button className="button" onClick={() => handleEditTransaction(transaction)}>
                      {messages.buttons.edit}
                    </button>
                    <button className="button" onClick={() => handleConfirmDelete(transaction.id!)}>
                      {messages.buttons.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={'←'}
            nextLabel={'→'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      )}
      {isDialogOpen && editTransaction && (
        <EditTransaction
          transaction={editTransaction}
          categories={data.categories}
          currency={data.currency}
          onSave={handleSaveTransaction}
          onClose={() => {
            setIsDialogOpen(false);
            setEditTransaction(null);
          }}
        />
      )}
      {confirmDeleteId && (
        <ConfirmDelete onConfirm={handleDeleteTransaction} onCancel={handleCancelDelete} />
      )}
    </div>
  );
};

export default Transactions;
