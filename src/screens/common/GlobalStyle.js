import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE0C9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },

  link: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  center: {
    alignItems: 'center',
    marginTop: 20,
  },

  googleButton: {
    backgroundColor: '#FF6B00',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
