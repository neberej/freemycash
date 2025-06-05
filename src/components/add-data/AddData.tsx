import React, { useState, useContext } from 'react';
import messages from '@src/static/messages.json';
import Overlay from '@src/components/overlay/Overlay';
import { useStore } from '@src/store/useStore';
import { Transaction } from '@src/types';
import { validateAndCreateTransaction } from '@src/utils/dataManager';
import './AddData.scss';

interface AddDataProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  initialData?: Transaction;
}

const AddData: React.FC<AddDataProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { data } = useStore();
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [date, setDate] = useState(initialData?.date || '');
  const [category, setCategory] = useState(initialData?.category || (data?.categories[0] || ''));
  const [merchant, setMerchant] = useState(initialData?.merchant || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');

  const handleSave = () => {
    try {
      const transactionInput = { type, date, category, merchant, amount };
      const transaction = validateAndCreateTransaction(transactionInput, data?.categories ?? [], initialData?.id);
      onSave(transaction);
      onClose();
    } catch (error) {
      alert(messages.errors.invalidData);
    }
  };

  return (
    <Overlay isOpen={isOpen} onClose={onClose}>
      <div className="add-data">
        <h2>{initialData ? messages.buttons.edit : messages.header.addTransaction}</h2>
        <select className="dropdown" value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
          <option value="expense">{messages.transactions.expenses}</option>
          <option value="income">{messages.transactions.income}</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {type === 'expense' && (
          <select className="dropdown" value={category} onChange={(e) => setCategory(e.target.value)}>
            {data?.categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
        <input
          type="text"
          placeholder={messages.addTransaction.merchantPlaceholder}
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
        />
        <input
          type="number"
          placeholder={messages.addTransaction.amountPlaceholder}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="add-data-actions">
          <button className="button" onClick={handleSave}>{messages.buttons.save}</button>
          <button className="button dark" onClick={onClose}>{messages.buttons.cancel}</button>
        </div>
      </div>
    </Overlay>
  );
};

export default AddData;