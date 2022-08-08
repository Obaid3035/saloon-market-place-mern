import * as action from "./types";
import axios from "axios";

export const createStaffStart = () => {
	return {
		type: action.CREATE_STAFF_START
	}
}

export const createStaffFail = () => {
	return {
		type: action.CREATE_STAFF_FAIL
	}
}

export const createStaffSuccess = () => {
	return {
		type: action.CREATE_STAFF_SUCCESS
	}
}

const token = localStorage.getItem('vendorToken');


export const createStaff = (formData) => {
	return dispatch => {
		dispatch(createStaffStart());
		axios.post('/vendor/staff', formData, {headers: {"Authorization": `Bearer ${token}`}})
			.then(() => {
				dispatch(createStaffSuccess());
			})
			.catch(() => {
				dispatch(createStaffFail());
			})
	}
}

export const fetchStaffStart = () => {
	return {
		type: action.FETCH_STAFF_START
	}
}

export const fetchStaffFail = () => {
	return {
		type: action.FETCH_STAFF_FAIL
	}
}

export const fetchStaffSuccess = (staffData) => {
	return {
		type: action.FETCH_STAFF_SUCCESS,
		payload: {
			staffData
		}
	}
}



export const fetchStaff = () => {
	return dispatch => {
		dispatch(fetchStaffStart());
		axios.get('/vendor/staffs', {headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				console.log(res.data)
				dispatch(fetchStaffSuccess(res.data));
			}).catch((err) => {
			dispatch(fetchStaffFail(err))
		})
	}
}

export const editStaffStart = () => {
	return {
		type: action.EDIT_STAFF_START
	}
}

export const editStaffFail = () => {
	return {
		type: action.EDIT_STAFF_FAIL
	}
}

export const editStaffSuccess = (staffData) => {
	return {
		type: action.EDIT_STAFF_SUCCESS,
		payload: {
			staffData
		}
	}
}

export const editStaff = (staffId, formData) => {
	console.log(formData)
	return dispatch => {
		dispatch(editStaffStart());
		axios.put('/vendor/staff/' + staffId, formData,{headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				dispatch(editStaffSuccess(res.data));
			}).catch((err) => {
			dispatch(editStaffFail(err))
		})
	}
}

export const deleteStaffStart = () => {
	return {
		type: action.DELETE_STAFF_START
	}
}

export const deleteStaffFail = () => {
	return {
		type: action.DELETE_STAFF_FAIL
	}
}

export const deleteStaffSuccess = (staffData) => {
	return {
		type: action.DELETE_STAFF_SUCCESS,
		payload: {
			staffData
		}
	}
}

export const deleteStaff = (staffId) => {
	return dispatch => {
		dispatch(deleteStaffStart());
		axios.delete('/vendor/staff/' + staffId,{headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				dispatch(deleteStaffSuccess(res.data));
			}).catch((err) => {
			dispatch(deleteStaffFail(err))
		})
	}
}

