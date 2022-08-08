import React, { useState } from 'react';
import Logo from '../../../../assets/customer/img/footer-logo.png'
import { Button, Col, Form, Row } from "react-bootstrap";
import './Register.css'
import { NavLink } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import inputValidation from "../../../customer/Pages/Login/inputValidation";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import * as action from "../../../../Store/vendor/actions";
import Loader from "../../../../lib/customer/Loader/Loader";

const Register = props => {
	const { register, handleSubmit, formState: { errors }, control } = useForm();

	let formButton = (
		<>
			<Button className={'header__btn uppercase mt-3 w-100 p-3'} type={'submit'}>Discover for free</Button>
		</>
	)

	let errorMessage = null;

	if (props.loading) {
		formButton = <Loader style={'text-center'} />
	}

	if (props.error) {
		errorMessage = <p className={'text-danger font-weight-bold '}>{props.error}</p>
	}

	const onFormSubmit = (data) => {
		const { email, password, phoneNumber } = data;
		props.onAuth(email, password, true, phoneNumber);
	}
	return (
		<div className={'container-fluid'}>
			<Row>
				<Col md={6} id={'left__content'}>
					<Row id={'left_content_text'} className={'justify-content-end'}>
						<Col sm={12} lg={8} >
							<div className={'white'}>
								<img alt={'logo'} src={Logo} className={'img-fluid w-50 py-3'} />
								<h6 className={'bold left__text'}>Are You A
									<span className={'uppercase'}> Beauty Professional?</span>
									<br />
									We Support You in Developing Your Business
								</h6>
								<ul className={'left__list light pl-0'}>
									<li>A Platform with 2 million visitor per month</li>
									<li>A Platform with 2 million visitor per month</li>
									<li>A Platform with 2 million visitor per month</li>
									<li>A Platform with 2 million visitor per month</li>
								</ul>
							</div>
						</Col>
					</Row>
				</Col>
				<Col md={6} id={'right__content'}>
					<Row className={'justify-content-center'}>
						<Col xl={8} className={'px-5 py-4'}>
							<small className="text-center">
								{errorMessage}
							</small>
							<div className={'py-5 my-4 shadow shadow-md'} id={'register__form'}>
								<p className={'uppercase medium'}>Your Details</p>
								<Form onSubmit={handleSubmit(onFormSubmit)}>
									<div className="input-group mb-2">
										<Form.Control type={'text'} placeholder={'EMAIL'} className={'detail__input__login_customer py-4'} {...register('email', inputValidation.email)} />

										<div className="input-group-append">
											<i className="zmdi zmdi-email input-group-text input__prepend__login_customer" />
										</div>
									</div>
									<small className="text-danger">
										{errors.email && errors.email.message}
									</small>									
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
								<div className={'text-center mt-5'}>
									Already have an Account ? <NavLink to={'/vendor/login'}>Login</NavLink>
								</div>
								<p className={'light mt-5'} style={{ fontSize: '10px' }}>By clicking on this button you accept <span className={'bold'}>our general conditions of use.</span></p>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		loading: state.vendorAuth.loading,
		error: state.vendorAuth.error
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignUp, phoneNumber) => dispatch(action.vendorAuth(email, password, isSignUp, phoneNumber))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);


