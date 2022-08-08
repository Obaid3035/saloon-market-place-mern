import * as mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import StaffSchema from "./staff";

import {
	UnAuthorized, NotFound
} from '../lib/errorCode';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	paymentId: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	visible: {
		type: Boolean,
		required: true,
		default: false
	},
	profileSetup: {
		type: Boolean,
		required: true,
		default: false
	},
	role: [
		{
			type: String,
			required: true
		},
	],
	shop: {
			type: Schema.Types.ObjectId,
			ref: "shop"
		}
});

// Static methods
UserSchema.pre("save", async function ( next ){
	const user = this;
	if (user.password && user.isNew) {
		this.password = await bcrypt.hash(user.password, 10)
		next()
	}
})

UserSchema.statics.userExist = async function ({ email }){
	const user = await User.findOne({ email });
	if (user) {
		throw new UnAuthorized('User already exist');
	}
	return true;
}

UserSchema.statics.authenticate = async function (credentials){
	const user = await User.findOne({
		email: credentials.email,
		role: credentials.role
	});
	console.log(user)
	if (!user) {
		throw new NotFound('Unable to login. Please registered yourself');
	}
	const isMatch = await bcrypt.compare(credentials.password, user.password);

	if (!isMatch) {
		throw new NotFound('Email or Password is incorrect');
	}
	return user;
}

// Instance methods
UserSchema.methods.generateAuthToken = async function () {
	const user = this;
	return await jwt.sign({_id: user.id.toString()}, 'secret');
}

const User = mongoose.model('user', UserSchema);
export default User;

