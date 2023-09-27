import { useEffect, useReducer, useState } from 'react';
import { message } from 'antd';
import request, { setAuthorization } from '../utils/request';
import { getToken, removeToken, setToken } from '../utils/storage';

const initialState = {
  companyName: '',
  companyCNPJ: '',
  role: '',
  headquarterName: '',
  headquarterCNPJ: '',
  token: '',
  isAuthenticated: false,
};

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'setToken':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'check':
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        companyName: action.payload.companyName,
        companyCNPJ: action.payload.companyCNPJ,
        role: action.payload.role,
        headquarterName: action.payload.companyName,
        headquarterCNPJ: action.payload.companyCNPJ,
      };
    default:
      return state;
  }
};

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(UserReducer, initialState);

  useEffect(() => {
    (async () => {
      const token = getToken();

      if (token) {
        setAuthorization(token);
        try {
          const { data } = await request('/auth/check');
          dispatch({
            type: 'check',
            payload: { ...data, token },
          });
        } catch (err) {
          removeToken();
          document.location.reload();
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const {
        data: { token },
      } = await request.post('/auth/login', { username, password });
      setToken(token);
      document.location.reload();
    } catch (err) {
      message.error('Falha ao autenticar-se');
    }
  };

  const handleLogout = () => {
    removeToken();
    document.location.reload();
  };

  return { isLoading, state, dispatch, handleLogin, handleLogout };
}
