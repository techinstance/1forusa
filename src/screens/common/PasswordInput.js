import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const PasswordInput = ({ value, onChangeText, placeholder }) => {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secure}
      />
      <TouchableOpacity onPress={() => setSecure(!secure)}>
        <Text style={styles.toggle}>{secure ? 'Show' : 'Hide'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  toggle: {
    color: '#FF6B00',
    fontWeight: '600',
  },
});

export default PasswordInput;