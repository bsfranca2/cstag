import axios from 'axios';

export const request = axios.create({
  baseURL: 'http://localhost:3001',
});

export const setAuthorization = (token) => {
  request.defaults.headers = {
    ...request.defaults.headers,
    Authorization: `Bearer ${token}`,
  };
};
