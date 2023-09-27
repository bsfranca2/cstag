const tokenKey = 'cstag_access_token';
export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = (token) => localStorage.setItem(tokenKey, token);
export const removeToken = () => localStorage.removeItem(tokenKey);
