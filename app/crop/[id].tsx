import { AppButton } from '@/components/AppButton';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
    Alert.alert(
      'Close Crop',
      'Are you sure you want to close this crop? You cannot add expenses or income after closing.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Close',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'CLOSE_CROP',
              payload: { id: cropId, endDate: new Date().toISOString() },
            });
          },
        },
      ]
    );
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'DELETE_EXPENSE',
              payload: { id: expenseId },
            });
          },
        },
      ]
    );
  };

  const handleDeleteIncome = (incomeId: string) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'DELETE_INCOME',
              payload: { id: incomeId },
            });
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => new Date(dateString).toISOString().split('T')[0];

  return (
    <>
      <Stack.Screen options={{ title: crop.name }} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{crop.name}</Text>
          <Text style={styles.detail}>Status: {crop.status}</Text>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Expense</Text>
                  <Text style={[styles.summaryValue, styles.expenseValue]}>₹{summary.totalExpense.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Income</Text>
                  <Text style={[styles.summaryValue, styles.incomeValue]}>₹{summary.totalIncome.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Profit</Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      summary.profit >= 0 ? styles.incomeValue : styles.expenseValue,
                    ]}
                  >
                    ₹{summary.profit.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.expenseListBlock}>
        <Text style={styles.summaryTitle}>Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.placeholderText}>No expenses added</Text>
          ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseCardLeft}>
              <Text style={styles.expenseCardCategory}>{expense.category}</Text>
              <Text style={styles.expenseCardDate}>{new Date(expense.date).toISOString().split('T')[0]}</Text>
            </View>
            <View style={styles.expenseCardRight}>
              <Text style={styles.expenseCardAmount}>₹{expense.amount.toFixed(2)}</Text>
              <Pressable
                style={styles.deleteIconButton}
                onPress={() => handleDeleteExpense(expense.id)}
                disabled={crop.status === 'closed'}
              >
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
              </Pressable>
            </View>
          </View>
          ))
        )}
      </View>
      <View style={styles.expenseListBlock}>
        <Text style={styles.summaryTitle}>Income</Text>
        {incomes.length === 0 ? (
          <Text style={[styles.placeholderText, { color: '#666' }]}>No income added</Text>
        ) : (
          incomes.map((income) => (
            <View key={income.id} style={styles.expenseCard}>
              <View style={styles.expenseCardLeft}>
                <Text style={[styles.expenseCardCategory, { fontWeight: '600' }]}>{income.category || 'Other'}</Text>
                <Text style={styles.expenseCardDate}>{formatDate(income.date)}</Text>
                {income.note ? (
                  <Text numberOfLines={2} style={{ color: '#666', fontSize: 12 }}>
                    {income.note}
                  </Text>
                ) : null}
              </View>
              <View style={styles.expenseCardRight}>
                <Text style={[styles.expenseCardAmount, styles.incomeValue]}>₹{income.amount.toFixed(2)}</Text>
                <Pressable
                  style={styles.deleteIconButton}
                  onPress={() => handleDeleteIncome(income.id)}
                  disabled={crop.status === 'closed'}
                >
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
        </ScrollView>
      </View>

      <View style={styles.actionFooter}>
      <View style={styles.footerContent}>
        <View style={styles.buttonGroup}>
          <AppButton
            title="Add Expense"
            onPress={() => router.push(`/expense/add?cropId=${encodeURIComponent(cropId)}`)}
            disabled={crop.status === 'closed'}
            variant="primary"
          />
        </View>
        <View style={styles.buttonGroup}>
          <AppButton
            title="Add Income"
            onPress={() => router.push(`/income/add?cropId=${encodeURIComponent(cropId)}`)}
            disabled={crop.status === 'closed'}
            variant="secondary"
          />
        </View>
        <View style={styles.buttonGroup}>
          <AppButton
            title={crop.status === 'closed' ? 'Crop Closed' : 'Close Crop'}
            onPress={handleCloseCrop}
            disabled={crop.status === 'closed'}
            variant="danger"
          />
        </View>
      </View>
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 220,
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
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  expenseValue: {
    color: '#dc2626',
  },
  incomeValue: {
    color: '#16a34a',
  },
  expenseListBlock: {
    marginBottom: 24,
  },
  expenseLine: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 8,
  },
  actionFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  footerContent: {
    backgroundColor: '#ffffff',
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  expenseCardCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  expenseCardDate: {
    fontSize: 13,
    color: '#666666',
  },
  expenseCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  expenseCardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 4,
  },
  deleteIconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#ffe5e5',
    alignItems: 'center',
    justifyContent: 'center',
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
