import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import './App.css';

import { QueryClientProvider } from 'react-query';
import { queryClient } from './shared/queryClient';

import { AuthContextContainer } from './auth/components/AuthContext';
import { Navigation } from './Navigation';

import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <QueryClientProvider client={queryClient}>
        <AuthContextContainer>
          <Navigation />
        </AuthContextContainer>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
