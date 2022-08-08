import * as actionTypes from "../../vendor/actions/types";
import axios from "axios";

export const vendorLogOut = () => {

	return {
		type: actionTypes.VENDOR_LOGOUT
	}
}

export const vendorSetAuth = () => {
	return {
		type: actionTypes.VENDOR_SET_AUTH,
	}
}

export const vendorAuthStart = () => {
	return {
		type: actionTypes.VENDOR_AUTH_START
	}
}

export const vendorAuthSuccess = (authData) => {
	return {
		type: actionTypes.VENDOR_AUTH_SUCCESS,
		authData
	}
}

export const vendorAuthFail = (error) => {
	return {
		type: actionTypes.VENDOR_AUTH_FAIL,
		error
	}
}


export const vendorAuth = (email, password, isSignUp, phoneNumber) => {
	console.log(email, password, isSignUp, phoneNumber)
	return dispatch => {
		dispatch(vendorAuthStart())
		let authData = {
			phoneNumber,
			email,
			password,
			role: 'VENDOR'
		}
		let url = '/register'
		if(!isSignUp) {
			authData = {
				email,
				password,
				role: 'VENDOR'
			}
			url = '/login'
		}
		console.log(authData)
		axios.post(url, authData)
			.then((res) => {
				dispatch(vendorAuthSuccess(res.data))
				localStorage.setItem('vendorToken', res.data.token)
				localStorage.setItem('isProfileSetup', res.data.user.profileSetup);
				if (res.data.user.paymentId) {
					localStorage.setItem('PAID', true);
				} else {
					localStorage.setItem('PAID', false);
				}
				if(!res.data.user.profileSetup) {
					window.location.href = `/subscription`
				} else {
					window.location.href = '/vendor/dashboard'
				}
			})
			.catch((err) => {
				if (err.request) {
					dispatch(vendorAuthFail(err.response.data.message))
				} else {
					dispatch(vendorAuthFail(err.response.data.message))
				}
			})
	}
}
