import * as actionTypes from './actionTypes';
import axios from "axios";

export const logOut = () => {
	return {
		type: actionTypes.LOGOUT
	}
}

export const setAuth = () => {
	return {
		type: actionTypes.SET_AUTH,
	}
}

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

export const authSuccess = (authData) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		authData
	}
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error
	}
}


export const auth = (email, password, isSignUp, phoneNumber, isAppointment) => {
	return dispatch => {
		dispatch(authStart())
		let authData = {
			phoneNumber,
			email,
			password,
			role: 'CUSTOMER'
		}
		let url = '/register'
		if(!isSignUp) {
			authData = {
				email,
				password,
				role: 'CUSTOMER'
			}
			url = '/login'
		}
		axios.post(url, authData)
			.then((res) => {
				dispatch(authSuccess(res.data))
				localStorage.setItem('token', res.data.token)
				if (!isAppointment) {
					window.location.href = '/'
				} else {
					window.location.href = '/checkout'
				}
			})
			.catch((err) => {
				if (err.response.data.message) {
					dispatch(authFail(err.response.data.message))
				} else {
					dispatch(authFail(err.response.data.message))
				}
			})
	}
}
