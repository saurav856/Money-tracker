import { Transaction } from '@/types';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from '../styles/Transaction.module.css';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className={`${styles.emptyState} glass-panel`}>
        <p>No transactions yet. Start adding some!</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} glass-panel`}>
      {transactions.map(t => (
        <div key={t.id} className={styles.transactionItem}>
          <div className={styles.mainInfo}>
            <div className={`${styles.iconBox} ${t.type === 'income' ? styles.iconIncome : styles.iconExpense}`}>
              {t.type === 'income' ? <ArrowUpRight /> : <ArrowDownRight />}
            </div>
            <div className={styles.details}>
              <span className={styles.category}>{t.category}</span>
              {t.description && <span className={styles.desc}>{t.description}</span>}
              <span className={styles.date}>{formatDate(t.date)}</span>
            </div>
          </div>
          
          <div className={styles.amountActions}>
            <span className={`${styles.amount} ${t.type === 'income' ? styles.amountIncome : styles.amountExpense}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => onEdit(t)}>
                <Pencil size={18} />
              </button>
              <button className={`${styles.actionBtn} ${styles.deleteHover}`} onClick={() => onDelete(t.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
