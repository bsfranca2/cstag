import React from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { QueryClientProvider } from 'react-query';
import moment from 'moment';
import 'moment/locale/pt-br';
import AuthContextProvider from './contexts/AuthContext';
import Navigation from './routes/index';
import queryClient from './queryClient';
import './App.css';

moment.locale('pt-br');

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Navigation />
        </AuthContextProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
