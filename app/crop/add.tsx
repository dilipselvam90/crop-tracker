import { AppButton } from '@/components/AppButton';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppContext } from '@/context/AppContext';

export default function AddCropScreen() {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Crop name is required.');
      return;
    }

    dispatch({
      type: 'ADD_CROP',
      payload: {
        id: Date.now().toString(),
        name: name.trim(),
        startDate: new Date().toISOString(),
        status: 'active',
      },
    });

    setName('');
    setError('');
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Crop Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(value) => {
          setName(value);
          setError('');
        }}
        placeholder="Enter crop name"
      />
      <Text style={styles.label}>Start Date</Text>
      <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title="Create Crop" onPress={handleCreate} disabled={!name.trim()} />
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#374151',
  },
  error: {
    color: '#b91c1c',
    marginBottom: 12,
  },
});
