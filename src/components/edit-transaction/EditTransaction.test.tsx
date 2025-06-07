// src/components/edit-transaction/EditTransaction.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTransaction from './EditTransaction';
import { Transaction } from '@src/types';
import messages from '@src/static/messages.json';

jest.mock('@src/utils/dateAndTime', () => ({
  isValidDate: jest.fn(() => true),
  getCurrentDateISO: jest.fn(() => '2025-06-04'),
  toLocalDateInput: jest.fn((date: string) => date),
  fromLocalDateInput: jest.fn((date: string) => date),
}));

const defaultTransaction: Transaction = {
  id: 't-1',
  type: 'expense',
  date: '2025-06-01',
  category: 'Groceries',
  merchant: 'Costco',
  amount: 100,
};

const categories = ['Groceries', 'Clothing', 'Bills'];
const currency = 'USD';

describe('EditTransaction', () => {
  it('renders with pre-filled values', () => {
    render(
      <EditTransaction
        transaction={defaultTransaction}
        categories={categories}
        currency={currency}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('Costco')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-06-01')).toBeInTheDocument();
  });

  it('shows error if required fields are empty', async () => {
  render(
    <EditTransaction
      transaction={{
        id: 't-2',
        type: 'expense',
        date: '2025-06-01',
        merchant: '',
        amount: 0,
        category: '', // will be overridden to 'Groceries'
      }}
      categories={categories}
      currency={currency}
      onSave={jest.fn()}
      onClose={jest.fn()}
    />
  );

  // Simulate user clearing out the category
  fireEvent.change(screen.getByLabelText(/Category/i), {
    target: { value: '' },
  });

  fireEvent.click(screen.getByText(messages.buttons.save));

  expect(await screen.findByText('Merchant required')).toBeInTheDocument();
  expect(screen.getByText('Amount must be positive')).toBeInTheDocument();
  expect(screen.getByText('Category required')).toBeInTheDocument();
});



  it('calls onSave with correct data when form is valid', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    render(
      <EditTransaction
        transaction={defaultTransaction}
        categories={categories}
        currency={currency}
        onSave={onSave}
        onClose={onClose}
      />
    );

    fireEvent.change(screen.getByLabelText(/Merchant/i), { target: { value: 'Walmart' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '55.5' } });
    fireEvent.click(screen.getByText(messages.buttons.save));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          merchant: 'Walmart',
          amount: 55.5,
          date: '2025-06-01',
        })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('hides category field for income type', () => {
    render(
      <EditTransaction
        transaction={{ ...defaultTransaction, type: 'income' }}
        categories={categories}
        currency={currency}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByLabelText(/Category/i)).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(
      <EditTransaction
        transaction={defaultTransaction}
        categories={categories}
        currency={currency}
        onSave={jest.fn()}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText(messages.buttons.cancel || 'Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
