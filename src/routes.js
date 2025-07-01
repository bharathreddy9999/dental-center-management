import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Login} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/patients" component={Patients} />
                <ProtectedRoute path="/appointments" component={Appointments} />
                <ProtectedRoute path="/calendar" component={Calendar} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default Routes;