import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useAppContext();

  const handleAddCrop = () => {
    router.push('/crop/add');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmer Crop Tracker</Text>
      <Pressable style={styles.button} onPress={handleAddCrop}>
        <Text style={styles.buttonText}>Start New Crop</Text>
      </Pressable>
      {state.crops.length === 0 ? (
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>No crops yet</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {state.crops.map((crop) => (
            <Pressable
              key={crop.id}
              style={styles.cropCard}
              onPress={() => router.push(`/crop/${crop.id}`)}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropMeta}>Start date: {new Date(crop.startDate).toLocaleDateString()}</Text>
              <Text style={styles.cropStatus}>Status: {crop.status}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderCard: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
  cropCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 6,
  },
  cropMeta: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  cropStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
});
