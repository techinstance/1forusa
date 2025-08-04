import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  getUserInterests,
  getAvailableInterests,
} from '../Services/interestServices';

const InterestDisplayTest = () => {
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [allInterests] = useState(getAvailableInterests());

  useEffect(() => {
    loadUserInterests();
  }, []);

  const loadUserInterests = async () => {
    try {
      const interests = await getUserInterests();
      setUserInterests(interests);
    } catch (error) {
      console.error('Error loading user interests:', error);
    }
  };

  const getUserInterestDetails = () => {
    return allInterests.filter(interest => userInterests.includes(interest.id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Selected Interests</Text>

      {userInterests.length === 0 ? (
        <Text style={styles.noInterests}>
          No interests selected yet. Complete the signup process to select your
          interests!
        </Text>
      ) : (
        <View style={styles.interestsContainer}>
          {getUserInterestDetails().map(interest => (
            <View
              key={interest.id}
              style={[styles.interestChip, { borderColor: interest.color }]}
            >
              <Text style={styles.interestIcon}>{interest.icon}</Text>
              <Text style={styles.interestName}>{interest.name}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.instructions}>
        To modify your interests, complete a new signup flow or clear your app
        data and sign up again.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  noInterests: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 40,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 8,
  },
  interestIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  interestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    lineHeight: 18,
  },
});

export default InterestDisplayTest;
