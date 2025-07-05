<<<<<<< HEAD
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text, TextInput, Button, Switch, Card, Divider
} from 'react-native-paper';

const ActivitiesScreen = () => {
  const [dailyGoal, setDailyGoal] = useState('');
  const [howToAchieve, setHowToAchieve] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [yesterdayDone, setYesterdayDone] = useState('');
  const [oneMinActivity, setOneMinActivity] = useState('');
  const [fiveMinActivity, setFiveMinActivity] = useState('');
  const [weeklyGoals, setWeeklyGoals] = useState(['', '', '']);
  const [notToDo, setNotToDo] = useState(['', '', '']);
  const [completed, setCompleted] = useState(['', '', '', '', '']);
  const [requests, setRequests] = useState(['', '', '', '', '']);
  const [deepQuestion, setDeepQuestion] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Daily Goals</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput label="What's your goal today?" value={dailyGoal} onChangeText={setDailyGoal} style={styles.input} />
          <TextInput label="How will you achieve it?" multiline value={howToAchieve} onChangeText={setHowToAchieve} style={styles.input} />
          <View style={styles.switchRow}>
            <Text>Set as Public</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Yesterday’s Goal Check" />
        <Card.Content>
          <TextInput label="Completion Notes" value={yesterdayDone} onChangeText={setYesterdayDone} style={styles.input} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="1 Minute Activity" />
        <Card.Content>
          <TextInput label="Activity" value={oneMinActivity} onChangeText={setOneMinActivity} style={styles.input} />
          <Button mode="outlined" style={styles.button}>Start 1-min Timer</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="5 Minute Activity" />
        <Card.Content>
          <TextInput label="Activity" value={fiveMinActivity} onChangeText={setFiveMinActivity} style={styles.input} />
          <Button mode="outlined" style={styles.button}>Start 5-min Timer</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Weekly Goals" />
        <Card.Content>
          {weeklyGoals.map((g, i) => (
            <TextInput key={i} label={`Weekly Goal #${i + 1}`} value={g} onChangeText={(t) => {
              const list = [...weeklyGoals]; list[i] = t; setWeeklyGoals(list);
            }} style={styles.input} />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Not To Do List" />
        <Card.Content>
          {notToDo.map((n, i) => (
            <TextInput key={i} label={`Not-To-Do #${i + 1}`} value={n} onChangeText={(t) => {
              const list = [...notToDo]; list[i] = t; setNotToDo(list);
            }} style={styles.input} />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Deep Personal Questions" />
        <Card.Content>
          <TextInput label="Share with other gender" value={deepQuestion} onChangeText={setDeepQuestion} style={styles.input} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="I Completed Today" />
        <Card.Content>
          {completed.map((c, i) => (
            <TextInput key={i} label={`Completed #${i + 1}`} value={c} onChangeText={(t) => {
              const list = [...completed]; list[i] = t; setCompleted(list);
            }} style={styles.input} />
          ))}
          <Button mode="text">Attach</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="My Requests / Questions" />
        <Card.Content>
          {requests.map((r, i) => (
            <TextInput key={i} label={`Request #${i + 1}`} value={r} onChangeText={(t) => {
              const list = [...requests]; list[i] = t; setRequests(list);
            }} style={styles.input} />
          ))}
          <Button mode="text">Attach</Button>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 20 }} />

      <Text variant="titleMedium">Dashboard Snapshot</Text>
      <View style={styles.dashboard}>
        <Text>Daily Goal: {dailyGoal ? "✅" : "❌"}</Text>
        <Text>1-min Activity: {oneMinActivity ? "✅" : "❌"}</Text>
        <Text>5-min Activity: {fiveMinActivity ? "✅" : "❌"}</Text>
        <Text>Weekly Goals: {weeklyGoals.filter(g => g).length}/3</Text>
      </View>

    </ScrollView>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { marginBottom: 10 },
  input: { marginBottom: 12 },
  button: { marginTop: 10 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    marginVertical: 8,
  },
  dashboard: {
    backgroundColor: "#e9ecef",
    padding: 16,
    marginTop: 10,
    borderRadius: 8,
  },
});
=======
import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/Footer';

type ActivitesProps = NativeStackScreenProps<RootStackParamList, 'Activites'>;
const Activites = ({navigation: _navigation}: ActivitesProps) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Activities</Text>
            </View>
            <Footer/>
        </SafeAreaView>
    );
}
export default Activites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    }
});
>>>>>>> 350c5d76e6383d0b2169c10bbf425893411f6178
