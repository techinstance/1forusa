import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const TextBoxComponent = () => {
  const [text, setText] = useState('');
  const [multilineText, setMultilineText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text Box Component</Text>

      <Text style={styles.label}>Single Line Input:</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Enter text here..."
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Multi-line Input:</Text>
      <TextInput
        style={[styles.textInput, styles.multilineInput]}
        value={multilineText}
        onChangeText={setMultilineText}
        placeholder="Enter multiple lines of text..."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Preview:</Text>
        <Text style={styles.previewText}>Single: {text}</Text>
        <Text style={styles.previewText}>Multi: {multilineText}</Text>
      </View>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 15,
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  previewContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  previewText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

export default TextBoxComponent;
