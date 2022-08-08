import Appointment from "../../model/appointment";

module.exports = {
	async getPreviousAppointment(req, res, next) {
		try {
			const shop = req.user.shop;
			console.log(shop)
			const appointment = await Appointment.find({
				shop
			}, null,
				{limit: 10, sort: {'epoch': -1}});
			res.status(200).json(appointment);
		} catch (e) {
			next(e);
		}
	},
	async todayAppointments(req, res, next) {
		try {
			const shop = req.user.shop;
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const appointments = await Appointment.find({
				createdAt: {$gte: today}},
				shop
			).count();
			res.status(200).json(appointments)
		} catch (e) {
			next(e);
		}
	},
	async countAppointment(req, res, next) {
		try {
			const shop = req.user.shop;

			const pendingAppointments = await Appointment.find({
				status: 'PENDING',
				shop
			}).count();
			const completedAppointments = await Appointment.find({
				status: 'COMPLETED',
				shop
			}).count();
			const cancelledAppointments = await Appointment.find({
				status: 'CANCELLED',
				shop
			}).count();

			res.status(200).json({
				pendingAppointments,
				completedAppointments,
				cancelledAppointments
			})
		} catch (e) {
			next(e);
		}
	},

	async salesAppointments(req, res, next) {
		try {
			const shop = req.user.shop;
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const dailyAppointments = await Appointment.find({
				createdAt: {$gte: today},
				$or: [
					{status: 'COMPLETED'},
					{status: 'CANCELLED'}
				],

				shop
			}).select('totalPrice');
			const dailySales = dailyAppointments.reduce((acc, cur) => {
				console.log(acc, cur.totalPrice)
				return acc + cur.totalPrice
			}, 0);
			const week = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			console.log(week)
			const weeklyAppointments = await Appointment.find({
				createdAt: {$gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)},
				$or: [
					{status: 'COMPLETED'},
					{status: 'CANCELLED'}
				],
				shop
			}).select('totalPrice');
			const weeklySales = weeklyAppointments.reduce((acc, cur) => {
				console.log(acc, cur.totalPrice)
				return acc + cur.totalPrice
			}, 0);
			const month = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
			console.log(month)
			const monthlyAppointments = await Appointment.find({
				createdAt: {$gte: month},
					$or: [
						{status: 'COMPLETED'},
						{status: 'CANCELLED'}
					],
					shop
			}
			).select('totalPrice');
			const monthlySale = monthlyAppointments.reduce((acc, cur) => {
				console.log(acc, cur.totalPrice)
				return acc + cur.totalPrice
			}, 0);
			res.status(200).json({
				dailySales,
				weeklySales,
				monthlySale,
			});
		} catch (e) {
			next(e);
		}
	}
}