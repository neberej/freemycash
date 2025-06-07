import React, { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@src/types';
import Overlay from '@src/components/overlay/Overlay';
import { isValidDate, getCurrentDateISO, toLocalDateInput, fromLocalDateInput } from '@src/utils/dateAndTime';
import messages from '@src/static/messages.json';
import './EditTransaction.scss';

interface EditTransactionProps {
  transaction: Transaction;
  categories: string[];
  currency: string;
  onSave: (transaction: Transaction) => void;
  onClose: () => void;
}

const EditTransaction: React.FC<EditTransactionProps> = ({
  transaction,
  categories,
  currency,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Transaction>({
    ...transaction,
    id: transaction.id || `t-${Date.now()}`,
    date: transaction.date.includes('T') ? transaction.date.split('T')[0] : transaction.date,
    category: transaction.type === 'income' ? '' : transaction.category || categories[0] || 'Other',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync formData with transaction prop changes
  useEffect(() => {
    // Normalize date to yyyy-MM-dd format
    let normalizedDate = toLocalDateInput(transaction.date);
    //let normalizedDate = transaction.date;
    if (normalizedDate.includes('T')) {
      normalizedDate = normalizedDate.split('T')[0];
    }
    if (!isValidDate(normalizedDate)) {
      normalizedDate = getCurrentDateISO();
    }
    setFormData({
      ...transaction,
      id: transaction.id || `t-${Date.now()}`,
      date: normalizedDate,
      category: transaction.type === 'income' ? '' : transaction.category || categories[0] || 'Other',
    });
    setErrors({});
  }, [transaction, categories]);

  // Validate form data
  const validateForm = useCallback((data: Transaction): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    if (!data.date || !isValidDate(data.date)) {
      errors.date = 'Invalid date';
    }
    if (!data.merchant.trim()) {
      errors.merchant = 'Merchant required';
    }
    if (data.amount <= 0) {
      errors.amount = 'Amount must be positive';
    }
    if (data.type === 'expense' && !data.category) {
      errors.category = 'Category required';
    }
    return errors;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
      ...(name === 'type' && value === 'income' ? { category: '' } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      // Ensure date is in yyyy-MM-dd format
      const saveData = {
        ...formData,
        date: fromLocalDateInput(formData.date),
      };
      onSave(saveData);
      onClose();
    } catch (error) {
      setErrors({
        form: messages.errors?.saveFailed?.replace('{message}', (error as Error).message) || `Failed to save: ${(error as Error).message}`,
      });
    }
  };

  return (
    <Overlay isOpen={true} onClose={onClose}>
      <div className="edit-transaction">
        <h3>{transaction.id ? messages.transactions.edit : messages.transactions.add}</h3>
        {errors.form && <div className="error form-error">{errors.form}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="type">
              <span className="form-label">{messages.transactions.headers.type}</span>
              <select
                id="type"
                className={`dropdown ${errors.type ? 'error-border' : ''}`}
                name="type"
                value={formData.type}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.type}
              >
                <option value="income">{messages.transactions.types?.income || 'Income'}</option>
                <option value="expense">{messages.transactions.types?.expense || 'Expense'}</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="date">
              <span className="form-label">{messages.transactions.headers.date}</span>
              <input
                id="date"
                className={`input ${errors.date ? 'error-border' : ''}`}
                type="date"
                name="date"
                value={formData.date.includes('T') ? formData.date.split('T')[0] : formData.date}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.date}
              />
              {errors.date && <div className="error">{errors.date}</div>}
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="merchant">
              <span className="form-label">{messages.transactions.headers.merchant}</span>
              <input
                id="merchant"
                className={`input ${errors.merchant ? 'error-border' : ''}`}
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.merchant}
              />
              {errors.merchant && <div className="error">{errors.merchant}</div>}
            </label>
          </div>
          {formData.type === 'expense' && (
            <div className="form-row">
              <label htmlFor="category">
                <span className="form-label">{messages.transactions.headers.category}</span>
                <select
                  id="category"
                  className={`dropdown ${errors.category ? 'error-border' : ''}`}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.category}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="error">{errors.category}</div>}
              </label>
            </div>
          )}
          <div className="form-row">
            <label htmlFor="amount">
              <span className="form-label">
                {messages.transactions.headers.amount} ({currency})
              </span>
              <input
                id="amount"
                className={`input ${errors.amount ? 'error-border' : ''}`}
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                aria-required="true"
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <div className="error">{errors.amount}</div>}
            </label>
          </div>
          <div className="edit-transaction-actions">
            <button className="button" type="submit">
              {messages.buttons.save}
            </button>
            <button className="button" type="button" onClick={onClose}>
              {messages.buttons.cancel || 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
};

export default EditTransaction;