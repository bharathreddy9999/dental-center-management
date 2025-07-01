import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    user.role === 'Admin' || (user.role === 'Patient' && rest.path.includes('/patient')) ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to="/not-found" />
                    )
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;