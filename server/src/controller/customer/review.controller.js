import Review from "../../model/review";
import Shop from "../../model/shop";
import Appointment from "../../model/appointment";

module.exports = {
	async index(req, res, next) {
		try {
			const shopId = req.params.id;
			const reviews = await Review.find({shop: shopId, status: 'VISIBLE'});
			res.status(200).json({reviews});
		} catch (e) {
			next(e);
		}
	},
	async create(req, res, next) {
		try {
			const appointmentId = req.params.id;
			await Appointment.findOneAndUpdate(appointmentId, {
				status: 'CANCELLED'
			})
			const review = await Review.create(req.body);
			await Shop.findByIdAndUpdate(req.body.shop, {
				$push: { reviews: review._id }
			})
			const shop = await Shop.findById(req.body.shop)
				.populate('reviews');
			res.status(201).json({ shop, saved: true })
		} catch (e) {
			next(e);
		}
	},
	async getReviewByRating(req, res, next) {
		try {
			const shopId = req.params.id;
			const { rating } = req.query;
			console.log(rating)
			const reviews = await Review.find({rating, shop: shopId, status: 'VISIBLE'});
			res.status(200).json(reviews);
		} catch (e) {
			next(e);
		}
	},
}