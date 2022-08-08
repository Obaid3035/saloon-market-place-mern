import React from 'react';
import './Login.css';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as action from '../../../../Store/customer/actions/index';
import { connect } from "react-redux";
import inputValidation from "./inputValidation";
import Loader from "../../../../lib/customer/Loader/Loader";

const Login = props => {

	const { register, handleSubmit, formState: { errors } } = useForm();

	const onFormSubmit = (data) => {
		const { email, password } = data;
		props.onAuth(email, password, false);
	}

	let formButton = (
		<>
			<Button type={'submit'} className={'header__btn login__submit w-100'}>Login</Button>
			<NavLink to={'/forgetPassword'}><p className={'py-3'}>Forgot your Password?</p></NavLink>

		</>
	)
	if (props.loading) {
		formButton = <Loader style={'text-center'} />
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p className={'text-danger font-weight-bold '}>{props.error}</p>
	}

	return (
		<div className={'customer__auth'}>
			<Container className={'h-100 text-center'}>
				<Row className={'h-100 align-items-center justify-content-center'}>
					<Col md={5}>
						<small className="text-center">
							{errorMessage}
						</small>
						<div className={'customer__login__top-01 text-center px-3 pt-3'}>
							<p>Have You used Thiaza before?</p>
							<Form onSubmit={handleSubmit(onFormSubmit)}>
								<div className="input-group mb-2">
									<Form.Control type={'text'} placeholder={'EMAIL'} className={'detail__input__login_customer py-4'}
										{...register('email', inputValidation.email)} />

									<div className="input-group-append">
										<i className="zmdi zmdi-email input-group-text input__prepend__login_customer" />
									</div>
								</div>
								<small className="text-danger">
									{errors.email && errors.email.message}
								</small>
								<div className="input-group mb-2">
									<Form.Control type={'password'} placeholder={'PASSWORD'} className={'detail__input__login_customer py-4'}
										{...register('password', inputValidation.password)} />

									<div className="input-group-append">
										<i className="zmdi zmdi-key input-group-text input__prepend__login_customer" />
									</div>
								</div>
								<small className="text-danger">
									{errors.password && errors.password.message}
								</small>
								{formButton}
							</Form>
						</div>
						<h5 className={'text-center'}>Or</h5>
						<div className={'customer__login__bottom-02 text-center p-4'}>
							<p>New to Thiaza?</p>
							<NavLink to={'/register'}><Button className={'login__btn w-100'}>Register Now</Button></NavLink>
							<NavLink to={"/vendor/login"} style={{ cursor: "pointer" }}><p className="pt-2">Become a partner</p></NavLink>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (name, email, password, isSignUp) => dispatch(action.auth(name, email, password, isSignUp))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);