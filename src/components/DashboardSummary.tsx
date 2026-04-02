import { Transaction } from '@/types';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import styles from '../styles/Dashboard.module.css';

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export function DashboardSummary({ transactions }: DashboardSummaryProps) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={styles.summaryGrid}>
      <div className={`${styles.summaryCard} glass-panel`}>
        <div className={`${styles.iconWrapper} ${styles.iconBalance}`}>
          <Wallet size={24} />
        </div>
        <div className={styles.cardContent}>
          <span className={styles.cardTitle}>Total Balance</span>
          <span className={styles.cardAmount}>{formatCurrency(balance)}</span>
        </div>
      </div>

      <div className={`${styles.summaryCard} glass-panel`}>
        <div className={`${styles.iconWrapper} ${styles.iconIncome}`}>
          <TrendingUp size={24} />
        </div>
        <div className={styles.cardContent}>
          <span className={styles.cardTitle}>Total Income</span>
          <span className={styles.cardAmount}>{formatCurrency(income)}</span>
        </div>
      </div>

      <div className={`${styles.summaryCard} glass-panel`}>
        <div className={`${styles.iconWrapper} ${styles.iconExpense}`}>
          <TrendingDown size={24} />
        </div>
        <div className={styles.cardContent}>
          <span className={styles.cardTitle}>Total Expense</span>
          <span className={styles.cardAmount}>{formatCurrency(expense)}</span>
        </div>
      </div>
    </div>
  );
}
