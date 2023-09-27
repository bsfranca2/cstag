import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import AuthRoute from './authRoute';
import UnauthRoute from './unauthRoute';

import Home from '../views/Home/index';
import Login from '../views/Login/index';
import Accounts from '../views/Accounts/index';
import TollPlazas from '../views/TollPlazas/index';
import TollPlazaDetails from '../views/TollPlazas/Details';
import Invoices from '../views/Invoices/index';
import TollTicket from '../views/TollTicket/index';
import TollValley from '../views/TollValley/index';
import MonthlyPayments from '../views/MonthlyPayments/index';
import Vehicles from '../views/Vehicles/index';
import Trailers from '../views/Trailers/index';

export default () => {
  return (
    <Router>
      <Switch>
        <AuthRoute path='/' component={Home} exact />
        <UnauthRoute path='/entrar' component={Login} />
        <AuthRoute path='/acessos' component={Accounts} />
        <AuthRoute path='/pracas/:id' component={TollPlazaDetails} />
        <AuthRoute path='/pracas' component={TollPlazas} />
        <AuthRoute path='/faturas' component={Invoices} />
        <AuthRoute path='/passagens-pedagio' component={TollTicket} />
        <AuthRoute path='/vale-pedagio' component={TollValley} />
        <AuthRoute path='/veiculos' component={Vehicles} />
        <AuthRoute path='/carretas' component={Trailers} />
        <AuthRoute path='/mensalidades' component={MonthlyPayments} />
      </Switch>
    </Router>
  );
};
