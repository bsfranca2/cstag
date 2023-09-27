import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export default function AuthRoute(props) {
  const {
    state: { isAuthenticated },
  } = useAuthContext();

  if (!isAuthenticated) {
    return <Redirect to='/entrar' />;
  }

  return <Route {...props} />;
}
