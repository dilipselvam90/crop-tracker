import { AppButton } from '@/components/AppButton';
import { INCOME_CATEGORIES } from '@/constants/incomeCategories';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';

export default function AddIncomeScreen() {
  const { cropId } = useLocalSearchParams<{ cropId: string }>();
  const router = useRouter();
  const { dispatch, state } = useAppContext();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const crop = state.crops.find((c) => c.id === cropId);
  const cropClosed = crop?.status === 'closed';

  const parsedAmount = Number(amount.trim());
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount > 0;
  const isValidCategory = category.trim().length > 0;

  const handleSave = () => {
    if (!cropId) {
      setError('Crop ID is required.');
      return;
    }

    if (!isValidAmount) {
      setError('Enter valid amount greater than zero.');
      return;
    }

    if (!isValidCategory) {
      setError('Select a category.');
      return;
    }

    if (!crop) {
      setError('Crop not found.');
      return;
    }

    if (cropClosed) {
      setError('Cannot add income to a closed crop.');
      return;
    }

    const newIncome = {
      id: Date.now().toString(),
      cropId,
      category: category.trim(),
      amount: parsedAmount,
      date: new Date().toISOString(),
      note: note.trim(), // always string (cleaner)
    };

    dispatch({
      type: 'ADD_INCOME',
      payload: newIncome,
    });

    // reset (not strictly needed since you navigate away, but safer)
    setAmount('');
    setCategory('');
    setNote('');
    setError('');

    router.push(`/crop/${cropId}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Income' }} />

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

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {INCOME_CATEGORIES.map((cat) => {
            const selected = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setError('');
                }}
                style={[
                  styles.categoryButton,
                  selected && styles.categorySelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selected && styles.categorySelectedText,
                  ]}
                >
                  {cat}
                </Text>
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
          title="Save Income"
          onPress={handleSave}
          disabled={!isValidAmount || !isValidCategory || cropClosed}
        />
      </View>
    </>
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eeeeee',
  },
  categorySelected: {
    backgroundColor: '#007bff',
  },
  categoryButtonText: {
    color: '#333333',
    fontSize: 14,
  },
  categorySelectedText: {
    color: '#ffffff',
  },
  error: {
    color: '#b91c1c',
    marginBottom: 12,
  },
});