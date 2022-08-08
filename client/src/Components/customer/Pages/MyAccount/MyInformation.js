import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import inputValidation from "../Login/inputValidation";
import PhoneInput from 'react-phone-input-2'
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import axios from "axios";
import Paper from '@material-ui/core/Paper';

const Information = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const token = localStorage.getItem('token');

    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const onSubmit = (data) => {
        setLoading(true);
        console.log(data);
        if (data.newPassword !== data.confirmPassword) {
            setError('Password do not match')
        }
        axios.put('/user', data, { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setLoading(false)
                setError('');
                console.log(res.data);
            }).catch((err) => {
            setLoading(false)
            setError(err.response.data.message)
        })
    }

    let formButton = (
        <>
            <div className="text-center">
                <Button type={'submit'} className="header__btn login__submit w-25 mt-2">Edit</Button>
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
            <div className="info row justify-content-center mt-5">
                <div className="col-lg-5 my-info-pass-01 mt-2">
                    <Paper elevation={3} className="px-3 py-3">
                        <p>My Contact Details</p>
                        <div className="input-group">
                            <Form.Control type={'text'} placeholder={'Email'} {...register('email', inputValidation.email)} className={'detail__input__login_customer py-4'} />
                            <div className="input-group-append">
                                <i className="zmdi zmdi-email input-group-text input__prepend__login_customer" />
                            </div>
                        </div>
                        <small className="text-danger" style={{ fontSize: "10px" }}>
                            {errors.email && errors.email.message}
                        </small>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            rules={inputValidation.phoneNumber}
                            className={'detail__input__login_customer py-4'}
                            render={({ field: { value, onChange, ref } }) => (
                                <PhoneInput
                                    country={'us'}
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                        <small className="text-danger" style={{ fontSize: "10px" }}>
                            {errors.phoneNumber && errors.phoneNumber.message}
                        </small>

                    </Paper>
                </div>
            </div>
            <div className="info row justify-content-center mt-5">
                <div className="col-lg-5 mb-2">
                    <Paper elevation={3} className="px-3 py-3">
                        <p>Password</p>
                        <div className="input-group">
                            <Form.Control type={'password'} placeholder={'Current Password'} {...register('oldPassword', inputValidation.password)} className={'detail__input__login_customer py-4 mb-2'} />
                            <div className="input-group-append mb-2">
                                <i className="zmdi zmdi-key input-group-text input__prepend__login_customer" />
                            </div>
                        </div>
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

export default Information