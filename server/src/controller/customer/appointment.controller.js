import Appointment from "../../model/appointment";
import moment from "moment";
import appointmentConfirmation from "../../lib/emailServices/appointmentConfirmation";

//services shop
module.exports = {

	async pendingAppointment(req, res, next) {
		try {
			const user = req.user;
			const appointments = await Appointment.find({
				user: {
					$in: user._id
				},
				status: 'PENDING'
			}).select('status totalPrice date slot customerName').populate({
				path: 'shop',
				select: 'shopName shopImage address',
			})
			res.status(200).json(appointments)
		} catch (e) {
			next(e);
		}
	},

	async completedAppointment(req, res, next) {
		try {
			const user = req.user;
			const appointments = await Appointment.find({
				user: {
					$in: user._id
				},
				status: 'COMPLETED'
			}).select('status totalPrice date slot customerName').populate({
				path: 'shop',
				select: 'shopName shopImage address',
			})
			res.status(200).json(appointments)
		} catch (e) {
			next(e);
		}
	},

	async timeSlots(req, res, next) {
		try {
			const staffId =  req.params.id;
			const { storeId, day} = req.query;
			const slots = await Appointment.getSlots(staffId, storeId, day);
			res.status(200).json(slots);
		} catch (err) {
			next(err)
		}
	},
	async disabledDays(req, res, next) {
		try {
			const staffId = req.params.id;
			const appointments = await Appointment.find({ staffId }, 'start');
			res.status(200).json(appointments);
		} catch (err) {
			next(err);
		}
	},

	async create(req, res, next) {
		try {
			const duration = req.body.duration;
			let slot = req.body.slot;
			const startDate = moment(req.body.date)
			const [hour, mins] = slot.split(':');
			startDate.set({hour:hour ,minute:mins,second:0,millisecond:0})
			const end = new Date(startDate);
			const endDate = moment(end).add(duration, 'minutes')
			req.body.start = startDate.toDate();
			req.body.end = endDate.toDate();
			let endDateHours = endDate.hour();
			if (slot.length === 4) {
				slot = '0' + slot
			}
			const endDateMints = endDate.minute();
			let endSlot = `${slot}-${endDateHours}:${endDateMints}`
			if (endSlot.length === 4) {
				endSlot = '0' + endSlot
			}
			req.body.slot = endSlot
			await Appointment.create(req.body);
			await appointmentConfirmation(req.body.email)
			res.status(201).json({ saved: true});
		} catch (err) {
			console.log(err);
			next(err);
		}
	},

}