import User from "../model/user";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import {
	NotFound
} from '../lib/errorCode';
import sendForgotPasswordMail from "../lib/emailServices/forgotPassword";


module.exports = {
	async register(req, res, next) {
		const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
			return;
		}
		try {
			await User.userExist(req.body);
			const user = new User(req.body);
			await user.save();
			const token = await user.generateAuthToken();
			res.status(201).json({ token, saved: true, user });
		} catch (e) {
			console.log(e)
			next(e);
		}
	},

	async login(req, res, next) {
		try {
			const user = await User.authenticate(req.body);
			const token = await user.generateAuthToken();
			res.status(200).json({ user, token });
		} catch (e) {
			next(e);
		}
	},

	async getCurrentUser(req, res, next) {
		try {
			const user = req.user;
			res.status(200).json(user);
		} catch (e) {
			next(e);
		}
	},
	async editUser(req, res, next) {
		try {
			const authUser = req.user;
			const body = req.body;

			const isMatch = await bcrypt.compare(body.oldPassword, authUser.password);
			if(!isMatch) {
				throw new NotFound('Current password is incorrect');
			}
			body.password = await bcrypt.hash(body.newPassword, 10);
			await User.findByIdAndUpdate(authUser._id, body);
			res.status(200).json({updated: true})
		} catch (e) {
			next(e);
		}
	},

	async forgotPassword(req, res, next) {
		try {
			const { email } = req.body;
			console.log(email)
			const user = await User.findOne({email});
			if(!user) {
				throw new NotFound('Email not found');
			}
			await sendForgotPasswordMail(user);
			res.status(200).json({email: 'sent'});
		} catch (e) {
			console.log(e);
			next(e);
		}
	},

	async authenticate(req, res, next) {
		try {
			const token = req.params.id;
			const decode = jwt.verify(token, 'forgotpassword');
			const user = await User.findById(decode._id)
			if (!user) {
				res.status(200).send({authenticate: false});
			}
			res.status(200).json({authenticate: true});
		} catch (e) {
			console.log(e);
			next(e);
		}
	},

	async resetPassword(req, res, next) {
		try {
			const token = req.params.id;
			const { password } = req.body;
			const new_password = await bcrypt.hash(password, 10)
			const decode = jwt.verify(token, 'forgotpassword');
			await User.findByIdAndUpdate(decode._id, {
				password: new_password
			})

			res.status(200).json({updated: true});
		} catch (e) {
			console.log(e);
			next(e);
		}
	}

}