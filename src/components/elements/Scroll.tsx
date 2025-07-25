import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const Scroll = () => {
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scroll Component</Text>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  item: {
    backgroundColor: '#1976d2',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Scroll;
