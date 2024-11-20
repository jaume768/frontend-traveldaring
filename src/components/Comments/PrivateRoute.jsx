import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { authState } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={(props) =>
                !authState.loading && authState.token ? (
                    <Component {...props} />
                ) : !authState.loading && !authState.token ? (
                    <Redirect to="/login" />
                ) : (
                    <div>Loading...</div>
                )
            }
        />
    );
};

export default PrivateRoute;