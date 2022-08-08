import Package from "../../model/package";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_API_KEY)


module.exports = {
	async index(req, res, next) {
		try {
			const { user } = req;
			const packages = await Package.find({
				user: user.id
			});
			res.status(200).json(packages);
		} catch (e) {
			next(e);
		}
	},

	async create(req, res, next) {
		try {
			const { user } = req;
			const { name, description, price } = req.body;
			console.log(req.body);
			const product = await stripe.products.create({
				name,
			});
			console.log(product)
			const amount = await stripe.prices.create({
				unit_amount: price,
				currency: 'aed',
				recurring: {interval: 'month'},
				product: product.id,
			});

			await Package.create({name, description, price, productId: product.id, priceId: amount.id, user: user.id});
			res.status(201).json({saved: true});
		} catch (e) {
			next(e);
		}
	},
	// async update(req, res, next) {
	// 	try {
	// 		const { id } = req.params;
	// 		const { name, description, price } = req.body;
	// 		console.log(price)
	// 		const myPackage = await Package.findOne({ _id: id})
	// 		const product = await stripe.products.update(
	// 			myPackage.productId,
	// 			{
	// 				name
	// 			}
	// 		);
	// 		const amount = await stripe.prices.update(
	// 			myPackage.priceId,
	// 			{
	// 				unit_amount: parseInt(price)
	// 			}
	// 		);
	// 		await Package.findByIdAndUpdate(id, {
	// 			name, description, price, productId: product.id, priceId: amount.id
	// 		})
	// 	} catch (e) {
	// 		console.log(e);
	// 		next(e);
	// 	}
	// }
}
