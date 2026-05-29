import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { getCropSummary } from '@/utils/calculations';

export default function CropDetailScreen() {
  const { id: cropId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  if (!cropId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crop not found</Text>
      </View>
    );
  }

  const crop = state.crops.find((item) => item.id === cropId);

  if (!crop) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crop not found</Text>
      </View>
    );
  }

  const summary = getCropSummary(cropId, state);
  const expenses = state.expenses
    .filter((expense) => expense.cropId === cropId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const incomes = state.incomes
    .filter((income) => income.cropId === cropId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCloseCrop = () => {
    dispatch({
      type: 'CLOSE_CROP',
      payload: { id: cropId, endDate: new Date().toISOString() },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{crop.name}</Text>
      <Text style={styles.detail}>Status: {crop.status}</Text>

      <View style={styles.summaryBlock}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryLine}>Total Expense: ${summary.totalExpense.toFixed(2)}</Text>
        <Text style={styles.summaryLine}>Total Income: ${summary.totalIncome.toFixed(2)}</Text>
        <Text style={styles.summaryLine}>Profit: ${summary.profit.toFixed(2)}</Text>
      </View>

      <View style={styles.expenseListBlock}>
        <Text style={styles.summaryTitle}>Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.placeholderText}>No expenses added</Text>
          ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={styles.row}>
              <Text style={styles.expenseLine}>
                {expense.category} - ₹{expense.amount} - {new Date(expense.date).toISOString().split('T')[0]}
              </Text>
              <Button
                title="Delete"
                onPress={() => dispatch({ type: 'DELETE_EXPENSE', payload: { id: expense.id } })}
              />
            </View>
          ))
        )}
      </View>
      <View style={styles.expenseListBlock}>
        <Text style={styles.summaryTitle}>Income</Text>
        {incomes.length === 0 ? (
          <Text style={styles.placeholderText}>No income added</Text>
        ) : (
          incomes.map((income) => (
            <View key={income.id} style={styles.row}>
              <Text style={styles.expenseLine}>
                ₹{income.amount} - {new Date(income.date).toISOString().split('T')[0]}
              </Text>
              <Button
                title="Delete"
                onPress={() => dispatch({ type: 'DELETE_INCOME', payload: { id: income.id } })}
              />
            </View>
          ))
        )}
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="Add Expense"
          onPress={() => router.push(`/expense/add?cropId=${encodeURIComponent(cropId)}`)}
          disabled={crop.status === 'closed'}
        />
      </View>
      <View style={styles.buttonGroup}>
        <Button
          title="Add Income"
          onPress={() => router.push(`/income/add?cropId=${encodeURIComponent(cropId)}`)}
          disabled={crop.status === 'closed'}
        />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Close Crop" onPress={handleCloseCrop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  detail: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 20,
  },
  summaryBlock: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  summaryLine: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 6,
  },
  expenseListBlock: {
    marginBottom: 24,
  },
  expenseLine: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 15,
    color: '#6b7280',
  },
  buttonGroup: {
    marginBottom: 12,
  },
});
