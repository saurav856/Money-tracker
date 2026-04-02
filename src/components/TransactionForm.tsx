import { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '@/types';
import { X } from 'lucide-react';
import styles from '../styles/Transaction.module.css';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  editingTransaction?: Transaction | null;
}

export function TransactionForm({ isOpen, onClose, onSubmit, editingTransaction }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    
    setLoading(true);
    await onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      date,
      description
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} glass-panel`} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Type</label>
            <div className={styles.typeSelector}>
              <label className={`${styles.typeLabel} ${type === 'income' ? styles.activeIncome : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={() => setType('income')}
                />
                Income
              </label>
              <label className={`${styles.typeLabel} ${type === 'expense' ? styles.activeExpense : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={() => setType('expense')}
                />
                Expense
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={styles.input}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <input
              type="text"
              className={styles.input}
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              placeholder="e.g. Salary, Utilities, Food"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description (Optional)</label>
            <input
              type="text"
              className={styles.input}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
