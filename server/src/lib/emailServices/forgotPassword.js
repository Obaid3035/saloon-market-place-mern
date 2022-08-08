import sgMail from '@sendgrid/mail';
import jwt from "jsonwebtoken";

const apiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(apiKey);

const sendForgotPasswordMail = (user) => {
	const token = jwt.sign({ _id: user._id}, 'forgotpassword', { expiresIn: '20m'});

	sgMail
		.send({
			to: user.email, // Change to your recipient
			from: 'obaid3035@gmail.com', // Change to your verified sender
			subject: 'Recover Password',
			html: `
			<h3>Please click on the link below to recover your password</h3><br/>
			<a href="http://localhost:3000/resetPassword/${token}">Click Here</a>
			`
		})
		.then(() => {
			console.log('Email sent');
			return true;
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
};
export default sendForgotPasswordMail;
