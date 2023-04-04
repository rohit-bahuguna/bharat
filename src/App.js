import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { RedirectAs404 } from './utils/Utils';
import PrivateRoute from './route/PrivateRoute';

import Layout from './layout/Index';

import Error404Classic from './pages/error/404-classic';
import Error404Modern from './pages/error/404-modern';
import Error504Modern from './pages/error/504-modern';
import Error504Classic from './pages/error/504-classic';
import 'react-toastify/dist/ReactToastify.css';
import Faq from './pages/others/Faq';
import Terms from './pages/others/Terms';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Success from './pages/auth/Success';
import InvoicePrint from './pages/pre-built/invoice/InvoicePrint';
import { useSelector } from 'react-redux';
console.log(process.env.PUBLIC_URL);

const App = props => {
	const auth = useSelector(state => state.user.user.status);
	console.log(auth);
	return (
		<Switch>
			{/* Auth Pages */}
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/auth-success`}
				component={Success}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/auth-reset`}
				component={ForgotPassword}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/auth-register`}
				component={Register}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/auth-login`}
				component={Login}
			/>

			{/* Print Pages */}
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/invoice-print/:id`}
				component={InvoicePrint}
			/>

			{/* Helper pages */}
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/auths/terms`}
				component={Terms}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/auths/faq`}
				component={Faq}
			/>

			<Route
				exact
				path={`${process.env.PUBLIC_URL}/invoice-print`}
				component={InvoicePrint}
			/>

			{/*Error Pages*/}
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/errors/404-classic`}
				component={Error404Classic}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/errors/504-modern`}
				component={Error504Modern}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/errors/404-modern`}
				component={Error404Modern}
			/>
			<Route
				exact
				path={`${process.env.PUBLIC_URL}/errors/504-classic`}
				component={Error504Classic}
			/>

			{/*Main Routes*/}
			<PrivateRoute exact path="" component={Layout} auth={auth} />
			<Route component={RedirectAs404} />
		</Switch>
	);
};
export default withRouter(App);
