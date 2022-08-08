import Subscription from "../../model/subscription";
import Stripe from 'stripe';
import User from "../../model/user";
import Shop from "../../model/shop";
import moment from "moment";
import Package from "../../model/package";

const stripe = Stripe(process.env.STRIPE_API_KEY)

module.exports = {
	async create(req, res, next) {
		try {
			const user = req.user;
			let subscription;

			subscription = await Subscription.findOne({
				user: user._id,
			});
			if (subscription) {
				subscription.subscriptionStatus = 'PAID';
				subscription.expiryDate = moment().add(30, 'days');
				console.log(subscription)
				await subscription.save();
			} else {
				subscription = await Subscription.create({
					user: user._id,
					subscriptionStatus: req.body.subscriptionStatus,
					package: req.body.selectedPackageId,
					expiryDate: moment().add(30, 'days')
				});
			}

			res.status(200).json(subscription);
		} catch (e) {
			next(e);
		}
	},
	async StandardSubscribe(req, res, next) {
		try {
			let customer, subscription;
			const currentUser = req.user;
			const { payment_method, checkoutDetail, priceId } = req.body;
			const user = await User.findById(currentUser._id);
			if (user) {
				if (user.paymentId) {
					customer = await stripe.customers.retrieve(
						user.paymentId
					);
				} else {
					customer = await stripe.customers.create({
						payment_method,
						email: user.email,
						name: checkoutDetail.customerName,
						invoice_settings: {
							default_payment_method: payment_method
						}
					})
					user.paymentId = customer.id;
					await user.save()
				}
			if (customer) {
				subscription = await stripe.subscriptions.create({
					customer: customer.id,
					items: [
						{price: priceId},
					],
					expand: ['latest_invoice.payment_intent'],
				});
			}


				await Shop.findByIdAndUpdate(currentUser.shop, {
					shopStatus: 'ACTIVE'
				})
				res.send({
					status: subscription.latest_invoice.payment_intent.status,
					clientSecret: subscription.latest_invoice.payment_intent.client_secret,
				});
			} else {
				res.status(400).json('Something went wrong');
			}


		} catch (e) {
			console.log(e);
			next(e);
		}
	},

	async showAllPackage(req, res, next) {
		try {
			const myPackage = await Package.find({});
			res.status(200).json(myPackage);
		} catch (e) {
			next(e);
		}
	}
 }
