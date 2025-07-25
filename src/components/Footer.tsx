import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import type { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Social: undefined;
  Activities: undefined;
  Profile: undefined;
};

interface TabItem {
  name: keyof RootStackParamList;
  icon: string;
  label: string;
}

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  const tabs: TabItem[] = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Social', icon: 'users', label: 'Social' },
    { name: 'Activities', icon: 'calendar', label: 'Activities' },
    { name: 'Profile', icon: 'user', label: 'Profile' },
  ];

  const handleTabPress = (screenName: keyof RootStackParamList) => {
    if (route.name !== screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.footer}>
      {tabs.map(tab => {
        const isActive = route.name === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.tabContent, isActive && styles.activeTab]}>
              <Icon
                name={tab.icon}
                size={22}
                color={isActive ? '#007AFF' : '#8E8E93'}
              />
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 44,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
