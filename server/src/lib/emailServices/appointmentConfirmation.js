import sgMail from '@sendgrid/mail';
import jwt from "jsonwebtoken";

const apiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(apiKey);

const appointmentConfirmation = (email) => {

	sgMail
		.send({
			to: email, // Change to your recipient
			from: 'obaid3035@gmail.com', // Change to your verified sender
			subject: 'Your Appointment',
			html: `
			<h3>Your Appointment has been scheduled</h3><br/>
			<p>Thank your for booking appointment from <b>Thiaza</b></p>
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
export default appointmentConfirmation;
