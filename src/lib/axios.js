import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;