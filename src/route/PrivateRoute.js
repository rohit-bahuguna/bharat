import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ exact, component: Component, auth, ...rest }) =>
	<Route
		exact={exact ? true : false}
		rest
		render={props =>
			auth
				? <Component {...props} {...rest} />
				: <Redirect to={`${process.env.PUBLIC_URL}/auth-login`} />}
	/>;

export default PrivateRoute;
