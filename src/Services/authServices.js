import api from '../lib/axios';

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const errMessages =
      error?.response?.data?.errMessages || 'Something went wrong';
    throw new Error(errMessages);
  }
};

const signup = async (name, email, password, confirmPassword) => {
  try {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    const errMessages =
      error?.response?.data?.errMessages || 'Something went wrong';
    throw new Error(errMessages);
  }
};

export { login, signup };
