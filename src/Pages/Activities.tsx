import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text, TextInput, Button, Switch, Card, Divider, IconButton
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

  const renderListInputs = (label, items, setItems) =>
    items.map((val, i) => (
      <TextInput
        key={i}
        label={`${label} #${i + 1}`}
        value={val}
        onChangeText={(text) => {
          const updated = [...items];
          updated[i] = text;
          setItems(updated);
        }}
        mode="outlined"
        style={styles.input}
      />
    ));

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>🗓️ Daily Goal Tracker</Text>

      <Card style={styles.card}>
        <Card.Title title="🎯 Today's Goal" />
        <Card.Content>
          <TextInput
            label="What is your goal today?"
            value={dailyGoal}
            onChangeText={setDailyGoal}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="How will you achieve it?"
            value={howToAchieve}
            onChangeText={setHowToAchieve}
            mode="outlined"
            multiline
            style={styles.input}
          />
          <View style={styles.switchRow}>
            <Text>Set as Public</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="✅ Yesterday’s Review" />
        <Card.Content>
          <TextInput
            label="How did it go?"
            value={yesterdayDone}
            onChangeText={setYesterdayDone}
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="⚡ 1-Minute Focus" />
        <Card.Content>
          <TextInput
            label="Quick task"
            value={oneMinActivity}
            onChangeText={setOneMinActivity}
            mode="outlined"
            style={styles.input}
          />
          <Button icon="timer-outline" mode="outlined" style={styles.button}>
            Start 1-Min Timer
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="⏱️ 5-Minute Activity" />
        <Card.Content>
          <TextInput
            label="Short activity"
            value={fiveMinActivity}
            onChangeText={setFiveMinActivity}
            mode="outlined"
            style={styles.input}
          />
          <Button icon="clock-outline" mode="outlined" style={styles.button}>
            Start 5-Min Timer
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="📅 Weekly Goals" />
        <Card.Content>
          {renderListInputs("Weekly Goal", weeklyGoals, setWeeklyGoals)}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="🚫 Not-To-Do List" />
        <Card.Content>
          {renderListInputs("Avoid", notToDo, setNotToDo)}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="💬 Deep Personal Sharing" />
        <Card.Content>
          <TextInput
            label="Something to share..."
            value={deepQuestion}
            onChangeText={setDeepQuestion}
            mode="outlined"
            multiline
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="🏆 What I Completed Today" />
        <Card.Content>
          {renderListInputs("Completed", completed, setCompleted)}
          <Button icon="paperclip" mode="text">Attach</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="❓ My Requests & Questions" />
        <Card.Content>
          {renderListInputs("Request", requests, setRequests)}
          <Button icon="paperclip" mode="text">Attach</Button>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 20 }} />

      <Text variant="titleMedium" style={styles.subTitle}>📊 Dashboard Snapshot</Text>
      <View style={styles.dashboard}>
        <Text>🎯 Daily Goal: {dailyGoal ? "✅" : "❌"}</Text>
        <Text>⚡ 1-Min Activity: {oneMinActivity ? "✅" : "❌"}</Text>
        <Text>⏱️ 5-Min Activity: {fiveMinActivity ? "✅" : "❌"}</Text>
        <Text>📅 Weekly Goals: {weeklyGoals.filter(g => g).length}/3</Text>
      </View>
    </ScrollView>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f9',
  },
  title: {
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  dashboard: {
    backgroundColor: '#dfe6e9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 40,
  },
});
