import { AppButton } from '@/components/AppButton';
import { BackButton } from '@/components/back-button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';

export default function AddExpenseScreen() {
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const router = useRouter();
  const { dispatch, state } = useAppContext();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Land Preparation',
    'Seeds',
    'Fertilizer',
    'Pesticide',
    'Labor',
    'Irrigation',
    'Harvest',
    'Transport',
    'Other',
  ];

  const crop = state.crops.find((c) => c.id === cropId);
  const cropClosed = crop?.status === 'closed';

  const handleSave = () => {
    if (!cropId) {
      setError('Crop ID is required.');
      return;
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      setError('Amount must be numeric.');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    if (!category.trim()) {
      setError('Category is required.');
      return;
    }

    if (!crop) {
      setError('Crop not found.');
      return;
    }

    if (cropClosed) {
      setError('Cannot add expense to a closed crop.');
      return;
    }

    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: Date.now().toString(),
        cropId,
        category: category.trim(),
        amount: parsedAmount,
        date: new Date().toISOString(),
        note: note.trim() || undefined,
      },
    });

    router.push(`/crop/${cropId}`);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={(value) => {
          setAmount(value);
          setError('');
        }}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((c) => {
          const selected = c === category;
          return (
            <Pressable
              key={c}
              style={[styles.categoryButton, selected && styles.categorySelected]}
              onPress={() => {
                setCategory(c);
                setError('');
              }}>
              <Text style={[styles.categoryButtonText, selected && styles.categorySelectedText]}>{c}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Optional note"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton
        title="Save Expense"
        onPress={handleSave}
        disabled={!category.trim() || Number.isNaN(Number(amount)) || Number(amount) <= 0 || cropClosed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  error: {
    color: '#b91c1c',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
  },
  categorySelected: {
    backgroundColor: '#2563eb',
  },
  categoryButtonText: {
    color: '#1f2937',
    fontSize: 14,
  },
  categorySelectedText: {
    color: '#ffffff',
  },
});
