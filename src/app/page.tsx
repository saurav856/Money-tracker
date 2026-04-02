"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSupabaseTransactions } from '@/hooks/useSupabaseTransactions';
import { DashboardSummary } from '@/components/DashboardSummary';
import { TransactionList } from '@/components/TransactionList';
import { TransactionForm } from '@/components/TransactionForm';
import { Transaction } from '@/types';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useSupabaseTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenForm = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
    } else {
      setEditingTransaction(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
    } else {
      await addTransaction(transactionData);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'var(--expense)' }}>
        <h2>Error connecting to database</h2>
        <p>{error}</p>
        <p>Please check your Supabase credentials in .env.local and make sure your 'transactions' table is set up properly.</p>
      </div>
    );
  }

  return (
    <main className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Money Tracker</h1>
        <button className={styles.addButton} onClick={() => handleOpenForm()}>
          <Plus size={20} />
          New Transaction
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading transactions...</div>
      ) : (
        <>
          <DashboardSummary transactions={transactions} />
          
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Recent Transactions</h2>
            <TransactionList 
              transactions={transactions} 
              onEdit={handleOpenForm} 
              onDelete={handleDelete} 
            />
          </div>
        </>
      )}

      <TransactionForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        editingTransaction={editingTransaction}
      />
    </main>
  );
}
