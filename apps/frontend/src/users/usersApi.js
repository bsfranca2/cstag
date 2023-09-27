import { request } from '../shared/request';

export const fetchUsers = () => request.get('/users').then((res) => res.data);

export const updateUser = ({ userId, password }) =>
  request.patch(`/users/${userId}`, { password }).then((res) => res.data);

export const createUser = (values) =>
  request.post('/users', values).then((res) => res.data);

export const generateResetUserPasswordLink = (userId) =>
  request.get(`/users/${userId}/resetPassword`).then((res) => res.data);
