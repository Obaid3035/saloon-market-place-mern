import Appointment from "../../model/appointment";

module.exports = {
	async index(req, res, next) {
		try {
			const shopId = req.user.shop;
			const appointments = await Appointment.find({shop: shopId}).populate('user');
			res.status(200).json(appointments);
		} catch (err) {
			next(err);
		}
	},
	async getPendingAppointment(req, res, next) {
		try {
			const shopId = req.user.shop;
			const appointments = await Appointment.find({shop: shopId, status: 'PENDING'}).populate('user');
			res.status(200).json(appointments);
		} catch (e) {
			next(e);
		}
	},

	async getCancelledAppointment(req, res, next) {
		try {
			const shopId = req.user.shop;
			const appointments = await Appointment.find({shop: shopId, status: 'CANCELLED'}).populate('user');
			res.status(200).json(appointments);
		} catch (e) {
			next(e);
		}
	},
	async getCompletedAppointment(req, res, next) {
		try {
			const shopId = req.user.shop;
			const appointments = await Appointment.find({shop: shopId, status: 'COMPLETED'}).populate('user');
			res.status(200).json(appointments);
		} catch (e) {
			next(e);
		}
	},

	async updateCompletedAppointment(req, res, next) {
		try {
			const appointmentId = req.params.id
			await Appointment.findByIdAndUpdate(appointmentId, {
				status: 'COMPLETED'
			})
			res.status(200).json({ updated: true });

		} catch (e) {
			next(e);
		}
	},

	async updatePendingAppointment(req, res, next) {
		try {
			const appointmentId = req.params.id
			await Appointment.findByIdAndUpdate(appointmentId, {
				status: 'PENDING'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},

	async updateCancelledAppointment(req, res, next) {
		try {
			const appointmentId = req.params.id
			await Appointment.findByIdAndUpdate(appointmentId, {
				status: 'CANCELLED'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	}
}