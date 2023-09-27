import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, RequireUnauth, ProtectedRoutes } from './shared/router';
import { Admin, User } from './users/userRole';
import { HomeAuthenticated } from './home';
import Login from './auth/pages/Login';
import Users from './users/pages/Users';
import Companies from './companies/pages/Companies';
import TollPlazasPeriods from './tollPlazas/pages/TollPlazasPeriods';
import TollPlazaPeriodDetails from './tollPlazas/pages/TollPlazaPeriodDetails';
import Invoices from './invoices/pages/Invoices';
import TollTicket from './analyzes/pages/TollTicket';
import TollValley from './analyzes/pages/TollValley';

export function Navigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/entrar"
          element={
            <RequireUnauth>
              <Login />
            </RequireUnauth>
          }
        />
        {/* <UnauthRoute path='/resetar-senha' component={ResetPassword} /> */}
        <Route path="admin" element={<ProtectedRoutes roleRequired={Admin} />}>
          <Route element={<HomeAuthenticated />} index />
          <Route path="usuarios" element={<Users />} />
          <Route path="empresas" element={<Companies />} />
          <Route path="pracas">
            <Route path="" element={<TollPlazasPeriods />} index />
            <Route path=":id" element={<TollPlazaPeriodDetails />} />
          </Route>
        </Route>
        <Route
          path="transportadora"
          element={<ProtectedRoutes roleRequired={User} />}
        >
          <Route element={<HomeAuthenticated />} index />
          <Route path="faturas" element={<Invoices />} />
          <Route path="passagens-pedagio" element={<TollTicket />} />
          <Route path="vale-pedagio" element={<TollValley />} />
        </Route>
        {/* <AuthRoute path='/veiculos' component={Vehicles} /> */}
        {/* <AuthRoute path='/carretas' component={Trailers} /> */}
        {/* <AuthRoute path='/mensalidades' component={MonthlyPayments} /> */}
      </Routes>
    </Router>
  );
}
