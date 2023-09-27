import axios from 'axios';

const service = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:9292/api'
      : '/api',
});

export const setAuthorization = (token) => {
  service.defaults.headers = {
    ...service.defaults.headers,
    Authorization: `Bearer ${token}`,
  };
};

export default service;
