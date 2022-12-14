import React, { useState , useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import inputValidation from "../Components/customer/Pages/Login/inputValidation"
import ProgressBar from "../lib/customer/ProgressBar/ProgressBar";
import axios from "axios";
import Paper from '@material-ui/core/Paper';

const ResetPassword = props => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const { register, handleSubmit, formState: { errors }, control } = useForm();

	const token = props.match.params.id;

	const onSubmit = (data) => {
		setLoading(true);
		console.log(data);
		if (data.newPassword !== data.confirmPassword) {
			setError('Password do not match')
			setLoading(false)

		} else {
			axios.put(`reset-password/${token}`, {password: data.newPassword})
				.then((res) => {
					window.location.href = '/'
				}).catch((err) => {
				setLoading(false)
				if(err.response.data.message === 'jwt expired') {
					setError('Session Expired')
				}
			})
		}



	}



	useEffect(()=> {
		axios.get(`/authenticate/${token}`)
			.then((res) => {
				if(!res.data.authenticate){
					window.location.href = '/'
				}
			})
	},[])

	let formButton = (
		<>
			<div className="text-center">
				<Button type={'submit'} className="header__btn login__submit w-25 mt-2">Reset</Button>
			</div>
		</>
	)

	if (loading) {
		formButton = <ProgressBar shopProgress="adminlogin"
		                          shopRing="progress-info-ring" />
	}
	let errorMessage = null;

	if (error) {
		errorMessage = <p className={'text-danger font-weight-bold '}>{error}</p>
	}

	console.log("errors", errors)

	return (
		<Form onSubmit={handleSubmit(onSubmit)} className="my-info-main">
			<small className="text-center" style={{ fontSize: "16px" }}>
				{errorMessage}
			</small>
			<div style={{height: "80vh"}} className=" info row align-items-center justify-content-center mt-5">
				<div className="col-lg-5">
					<Paper elevation={3} className="px-3 py-3">
						<p>Password</p>
						<small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.oldPassword && errors.oldPassword.message}
						</small>
						<div className="input-group mb-2">
							<Form.Control type={'password'}
							              placeholder={'New Password'}
							              {...register('newPassword', inputValidation.newPassword)} className={'detail__input__login_customer py-4'} />
							<div className="input-group-append">
								<i className="zmdi zmdi-key input-group-text input__prepend__login_customer" />
							</div>
						</div>
						<small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.newPassword && errors.newPassword.message}
						</small>
						<div className="input-group mb-2">
							<Form.Control
								type={'password'}
								placeholder={'Confirm Password'}
								{...register('confirmPassword', inputValidation.confirmNewPassword)}
								className={'detail__input__login_customer py-4'}
							/>
							<div className="input-group-append">
								<i className="zmdi zmdi-key input-group-text input__prepend__login_customer" />
							</div>
						</div>
						<small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.confirmPassword && errors.confirmPassword.message}
						</small>
						{formButton}
					</Paper>

				</div>
			</div>
		</Form>

	)
}

export default ResetPassword