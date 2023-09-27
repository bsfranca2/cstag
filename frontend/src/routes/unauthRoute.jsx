import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export default function UnauthRoute(props) {
  const {
    state: { isAuthenticated },
  } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return <Route {...props} />;
}
