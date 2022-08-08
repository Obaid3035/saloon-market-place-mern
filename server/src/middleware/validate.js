import { body } from "express-validator";

const validate = (method) => {
	switch (method) {
		case 'createUser': {
			return [
				body('email', 'Invalid email').exists().isEmail(),
				body('password', 'Password is required and must be greater than 8 letters').exists().isLength(8),
				body('phoneNumber', 'Phone Number is required').exists(),
			]
		}
		case 'loginUser': {
			return [
				body('email', 'Invalid email').exists().isEmail(),
				body('password', 'Password is required and must be greater than 8 letters').exists().isLength(8),
			]
		}
	}
}

export default validate;