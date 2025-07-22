import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ value, onChangeText, placeholder, ...rest }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#888"
    {...rest}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
});

export default Input;