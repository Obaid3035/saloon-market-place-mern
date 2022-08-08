import Review from "../../model/review";

module.exports = {

	async index(req, res, next) {
		try {
			const shopId = req.user.shop
			const review = await Review.find({
				shop: shopId
			})
			res.status(200).json(review);
		} catch (e) {
			next(e);
		}
	},
	async getVisibleReview(req, res, next) {
		try {
			const shopId = req.user.shop
			const review = await Review.find({
				shop: shopId,
				status: 'VISIBLE'
			})
			res.status(200).json(review);
		} catch (e) {
			next(e);
		}
	},
	async getHiddenReview(req, res, next) {
		try {
			const shopId = req.user.shop
			const review = await Review.find({
				shop: shopId,
				status: 'HIDDEN'
			})
			res.status(200).json(review);
		} catch (e) {
			next(e);
		}
	},

	async toVisible(req, res, next) {
		try {
			console.log(req.params.id)
			const reviewId = req.params.id;
			await Review.findByIdAndUpdate(reviewId, {
				status: 'VISIBLE'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},

	async toHidden(req, res, next) {
		try {
			const reviewId = req.params.id;
			console.log(reviewId);
			await Review.findByIdAndUpdate(reviewId, {
				status: 'HIDDEN'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},
}