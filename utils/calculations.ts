import type { AppState } from '@/context/AppContext';

export function getCropSummary(cropId: string, state: AppState) {
  const totalExpense = state.expenses
    .filter((expense) => expense.cropId === cropId)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalIncome = state.incomes
    .filter((income) => income.cropId === cropId)
    .reduce((sum, income) => sum + income.amount, 0);

  return {
    totalExpense,
    totalIncome,
    profit: totalIncome - totalExpense,
  };
}
