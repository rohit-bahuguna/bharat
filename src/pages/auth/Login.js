import React, { useState } from 'react';
import {
	Block,
	BlockContent,
	BlockDes,
	BlockHead,
	BlockTitle,
	Button,
	Icon,
	PreviewCard
} from '../../components/Component';
import Logo from '../../images/logo.png';
import LogoDark from '../../images/logo-dark.png';
import { Form, Spinner, Alert } from 'reactstrap';
import PageContainer from '../../layout/page-container/PageContainer';
import Head from '../../layout/head/Head';
import AuthFooter from './AuthFooter';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/feateres/useSlice';
import { LogIn } from '../../utils/API/auth_API';

const Login = () => {
	const [userData, setUserData] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const [passState, setPassState] = useState(false);
	const [errorVal, setError] = useState('');
	const dispatch = useDispatch();

	const onFormSubmit = async () => {
		setLoading(true);

		try {
			const { data } = await LogIn(userData);

			dispatch(login(data.user));
			window.history.pushState(
				`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/'}`,
				'auth-login',
				`${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/'}`
			);
			window.location.reload();
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const { errors, register, handleSubmit } = useForm();

	return (
		<React.Fragment>
			<Head title="Login" />
			<PageContainer>
				<Block className="nk-block-middle nk-auth-body  wide-xs">
					<div className="brand-logo pb-4 text-center">
						<Link to={process.env.PUBLIC_URL + '/'} className="logo-link">
							<img
								className="logo-light logo-img logo-img-lg"
								src={Logo}
								alt="logo"
							/>
							<img
								className="logo-dark logo-img logo-img-lg"
								src={LogoDark}
								alt="logo-dark"
							/>
						</Link>
					</div>

					<PreviewCard className="card-bordered" bodyClass="card-inner-lg">
						<BlockHead>
							<BlockContent>
								<BlockTitle tag="h4">Sign-In</BlockTitle>
								<BlockDes />
							</BlockContent>
						</BlockHead>
						{errorVal &&
							<div className="mb-3">
								<Alert color="danger" className="alert-icon">
									{' '}<Icon name="alert-circle" /> Unable to login with
									credentials{' '}
								</Alert>
							</div>}
						<Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
							<div className="form-group">
								<div className="form-label-group">
									<label className="form-label" htmlFor="default-01">
										Email
									</label>
								</div>
								<div className="form-control-wrap">
									<input
										type="email"
										id="default-01"
										name="name"
										ref={register({ required: 'This field is required' })}
										value={userData.email}
										placeholder="Enter your email address or username"
										className="form-control-lg form-control"
										onChange={e =>
											setUserData({ ...userData, email: e.target.value })}
									/>
									{errors.name &&
										<span className="invalid">
											{errors.name.message}
										</span>}
								</div>
							</div>
							<div className="form-group">
								<div className="form-label-group">
									<label className="form-label" htmlFor="password">
										Passcode
									</label>
									<Link
										className="link link-primary link-sm"
										to={`${process.env.PUBLIC_URL}/auth-reset`}>
										Forgot Code?
									</Link>
								</div>
								<div className="form-control-wrap">
									<a
										href="#password"
										onClick={ev => {
											ev.preventDefault();
											setPassState(!passState);
										}}
										className={`form-icon lg form-icon-right passcode-switch ${passState
											? 'is-hidden'
											: 'is-shown'}`}>
										<Icon name="eye" className="passcode-icon icon-show" />

										<Icon name="eye-off" className="passcode-icon icon-hide" />
									</a>
									<input
										type={passState ? 'text' : 'password'}
										id="password"
										name="passcode"
										value={userData.password}
										ref={register({ required: 'This field is required' })}
										placeholder="Enter your passcode"
										className={`form-control-lg form-control ${passState
											? 'is-hidden'
											: 'is-shown'}`}
										onChange={e =>
											setUserData({ ...userData, password: e.target.value })}
									/>
									{errors.passcode &&
										<span className="invalid">
											{errors.passcode.message}
										</span>}
								</div>
							</div>
							<div className="form-group">
								<Button
									size="lg"
									className="btn-block"
									type="submit"
									color="primary">
									{loading ? <Spinner size="sm" color="light" /> : 'Sign in'}
								</Button>
							</div>
						</Form>
						<div className="form-note-s2 text-center pt-4">
							{' '}New on our platform?{' '}
							<Link to={`${process.env.PUBLIC_URL}/auth-register`}>
								Create an account
							</Link>
						</div>
						<div className="text-center pt-4 pb-3">
							<h6 className="overline-title overline-title-sap">
								<span>OR</span>
							</h6>
						</div>
						<ul className="nav justify-center gx-4">
							<li className="nav-item">
								<a
									className="nav-link"
									href="#socials"
									onClick={ev => {
										ev.preventDefault();
									}}>
									Facebook
								</a>
							</li>
							<li className="nav-item">
								<a
									className="nav-link"
									href="#socials"
									onClick={ev => {
										ev.preventDefault();
									}}>
									Google
								</a>
							</li>
						</ul>
					</PreviewCard>
				</Block>
				<AuthFooter />
			</PageContainer>
		</React.Fragment>
	);
};
export default Login;
