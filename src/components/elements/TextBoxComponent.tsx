import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

const TextBoxComponent = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');

  const handleRedButton = () => {
    setResponse('Bad stuff: Something went wrong!');
  };

  const handleGreenButton = () => {
    setResponse('Good stuff: Great job!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.contentText}>Steps + what's the ask</Text>
      </View>

      <TextInput
        style={styles.textBox}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter your actions/feelings"
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redButton} onPress={handleRedButton}>
          <Icon name='thumbs-o-down' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.greenButton} onPress={handleGreenButton}>
          <Icon name='thumbs-o-up' />
        </TouchableOpacity>
      </View>

      {response ? <Text style={styles.responseText}>{response}</Text> : null}
    </View>
  );
};

export default TextBoxComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  contentBox: {
    backgroundColor: '#ff8700',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  contentText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  redButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#388e3c',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  responseText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
