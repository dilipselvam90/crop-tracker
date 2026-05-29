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
  buttonGroup: {
    marginBottom: 12,
  },
});
