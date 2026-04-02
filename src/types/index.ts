export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string; // uuid from supabase
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
  created_at?: string;
}
