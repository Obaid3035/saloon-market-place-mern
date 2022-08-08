import Subscription from "../../model/subscription";
import moment from "moment";
import Shop from "../../model/shop";
import User from "../../model/user";

module.exports = {
	async getAllSubscriptions(req, res, next) {
		try {
			const subscription = await Subscription.find({}).populate('user');
			// if (subscription && subscription.length > 0) {
			// 	for (const sub of subscription) {
			// 		if (sub.expiryDate) {
			// 			const today = moment();
			// 			const expiry = moment(sub.expiryDate)
			// 			if (expiry.diff(today.add(30, 'days'), 'days') <= 0) {
			// 				const mySubscription = await Subscription.findById(sub._id);
			// 				mySubscription.subscriptionStatus = 'UNPAID'
			// 				await mySubscription.save();
			// 				const user = await User.findById(sub.user);
			// 				await Shop.findByIdAndUpdate(user.shop, {
			// 					shopStatus: 'INACTIVE',
			// 					shopVisibility: false
			// 				})
			// 			}
			// 		}
			// 	}
			// }
			res.status(200).json(subscription);
		} catch (e) {
			console.log(e)
			next(e)
		}
	},
	async getPaidSubscriptions(req, res, next) {
		try {
			const subscription = await Subscription.find({
				subscriptionStatus: 'PAID'
			}).populate('user');;
			res.status(200).json(subscription);
		} catch (e) {
			next(e)
		}
	},

	async getUnPaidSubscriptions(req, res, next) {
		try {
			const subscription = await Subscription.find({
				subscriptionStatus: 'UNPAID'
			}).populate('user');;
			res.status(200).json(subscription);
		} catch (e) {
			next(e)
		}
	},
}