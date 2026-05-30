import { SafeAreaView, ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';

export function ScreenContainer({ children, contentContainerStyle, style, ...props }: ScrollViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    padding: 20,
  },
});
