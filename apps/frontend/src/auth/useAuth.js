import { useEffect, useReducer, useState } from 'react';
import { message } from 'antd';
import { request, setAuthorization } from '../shared/request';
import { getToken, removeToken, setToken } from '../shared/storage';

/// TODO: refactor this
function displayErrors(err, defaultMessage) {
  if (err.response.data.errors) {
    message.error(err.response.data.errors[0].message);
  } else {
    message.error(defaultMessage || err.message);
  }
}

const initialState = {
  token: null,
  isAuthenticated: false,
  user: {
    username: null,
    companyName: null,
    headquarterName: null,
    role: null,
  },
};

function UserReducer(state, action) {
  switch (action.type) {
    case 'setUser':
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        user: {
          username: action.payload.username,
          role: action.payload.role,
          companyName: action.payload.company?.name,
          headquarterName: action.payload.company?.headquarter?.name,
        },
      };
    default:
      return { ...state };
  }
}

let hasFetched = false;
async function checkAuthorization(state, dispatch) {
  const token = getToken();

  if (!token || state.isAuthenticated || hasFetched) {
    return;
  }

  try {
    setAuthorization(token);
    // todo: check if refactor this
    const { data } = await request('/me');
    dispatch({
      type: 'setUser',
      payload: {
        ...data,
        token,
      },
    });
    hasFetched = true;
  } catch (err) {
    removeToken();
    document.location.reload();
  }
}

async function handleLogin(data) {
  try {
    const {
      data: { token },
    } = await request.post('/login', data);
    setToken(token);
    document.location.reload();
  } catch (err) {
    displayErrors(err, 'Falha ao autenticar');
  }
}

async function handleLoginAs(userId) {
  try {
    const {
      data: { token },
    } = await request.get(`/loginAs/${userId}`);
    setToken(token);
    document.location.reload();
  } catch (err) {
    displayErrors(err, 'Falha ao autenticar-se como outro usuário');
  }
}

function handleLogout() {
  removeToken();
  document.location.reload();
}

export function useAuth() {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthorization(state, dispatch)
      .then(() => setIsLoading(false))
      .catch((err) => displayErrors(err, 'Falha ao checar usuário logado'));
  }, []);

  return {
    state,
    isLoading,
    handleLogin,
    handleLoginAs,
    handleLogout,
  };
}
