import React from 'react';
import PhoneInput from 'react-phone-input-2'
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import * as action from '../../../../Store/customer/actions/index';
import inputValidation from "../Login/inputValidation";
import 'react-phone-input-2/lib/style.css';
import './Register.css'
import Loader from "../../../../lib/customer/Loader/Loader";


const Register = props => {
	const { register, handleSubmit, formState: { errors }, control } = useForm();

	const onFormSubmit = (data) => {
		const { email, password, phoneNumber } = data;
		props.onAuth(email, password, true, phoneNumber, false)
	}

	let formButton = (
		<>
			<Button type={'submit'} className={'header__btn login__submit w-100'}>Register</Button>
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
			<Container className={'h-100'}>
				<Row className={'h-100 justify-content-center align-items-center'}>
					<Col md={6}>
						<small className="text-center">
							{errorMessage}
						</small>
						<div className={'customer__reg__top-01 text-center p-4 shadow shadow-lg'}>
							<p>Have you used Thiaza before?</p>
							<NavLink to={'/login'}><Button className={'login__btn w-100'}>Login</Button></NavLink>
						</div>
						<h5 className={'text-center py-3'}>Or</h5>
						<div className={'customer__reg__top-02 text-center px-3 pt-3 shadow shadow-lg'}>
							<p>Have You used Thiaza before?</p>
							<Form onSubmit={handleSubmit(onFormSubmit)}>
								<Controller
									name="phoneNumber"
									control={control}
									rules={inputValidation.phoneNumber}
									render={({ field: { value, onChange, ref } }) => (
										<PhoneInput
											country={'us'}
											className={'mb-1'}
											value={value}
											onChange={onChange}
										/>
									)}
								/>

								<small className="text-danger">
									{errors.phoneNumber && errors.phoneNumber.message}
								</small>
								<div className="input-group mb-2">
									<Form.Control type={'text'} placeholder={'EMAIL'} className={'detail__input__login_customer py-4'} {...register('email', inputValidation.email)} />
									<div className="input-group-append">
										<i className="zmdi zmdi-email input-group-text input__prepend__login_customer" />
									</div>
								</div>
								<small className="text-danger">
									{errors.email && errors.email.message}
								</small>
								<div className="input-group mb-2">
									<Form.Control type={'password'} placeholder={'PASSWORD'} className={'detail__input__login_customer py-4'} {...register('password', inputValidation.password)} />
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
		onAuth: (email, password, isSignUp, phoneNumber, isAppointment) => dispatch(action.auth(email, password, isSignUp, phoneNumber, isAppointment))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);