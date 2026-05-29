import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';

export default function AddIncomeScreen() {
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const router = useRouter();
  const { dispatch } = useAppContext();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!cropId) {
      setError('Crop ID is required.');
      return;
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    dispatch({
      type: 'ADD_INCOME',
      payload: {
        id: Date.now().toString(),
        cropId,
        amount: parsedAmount,
        date: new Date().toISOString(),
        note: note.trim() || undefined,
      },
    });

    router.push(`/crop/${cropId}`);
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={(value) => setNote(value)}
        placeholder="Optional note"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Save Income"
        onPress={handleSave}
        disabled={Number.isNaN(Number(amount)) || Number(amount) <= 0}
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
});
