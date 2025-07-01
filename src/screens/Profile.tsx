import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText } from 'react-native-paper';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [gender, setGender] = useState('');
  const [timezone, setTimezone] = useState('');
  const [showGenderOnly, setShowGenderOnly] = useState(false);

  useEffect(() => {
    if (zipcode.length === 5) calculateTimezone(zipcode);
  }, [zipcode]);

  const calculateTimezone = (zip : string) => {
    const first = zip[0];
    const zone = first === '9' ? 'PT' : first === '8' ? 'MT' : first === '6' || first === '7' ? 'CT' : 'ET';
    setTimezone(`${zone} (auto detected)`);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Profile</Text>

      <TextInput label="Full Name" value={name} onChangeText={setName} style={styles.input} />

      <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />

      <TextInput label="Zip Code" value={zipcode} onChangeText={setZipcode} keyboardType="numeric" style={styles.input} />

      {timezone ? <HelperText type="info">Timezone: {timezone}</HelperText> : null}

      <TextInput label="Gender" value={gender} onChangeText={setGender} style={styles.input} />

      <View style={styles.switchRow}>
        <Text>Show questions to my gender only?</Text>
        <Switch value={showGenderOnly} onValueChange={setShowGenderOnly} />
      </View>

      <Button mode="contained" onPress={() => {}} style={{ marginTop: 20 }}>Save Profile</Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20  },
  input: { marginVertical: 8 },
  header: { marginBottom: 20 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
