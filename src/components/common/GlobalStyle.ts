// GlobalStyle.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  link: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
});

/* ──────────────────────────────────────────────
   EXPORT **BOTH** WAYS so any import works
   – named  →  import { GlobalStyles } from './GlobalStyle'
   – default → import GlobalStyles       from './GlobalStyle'
────────────────────────────────────────────── */
export const GlobalStyles = styles;
export default styles;
