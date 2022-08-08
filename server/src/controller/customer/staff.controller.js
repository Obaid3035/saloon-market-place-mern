import Shop from "../../model/shop";

module.exports = {
	async index(req, res, next) {
		try {
			const shopId = req.params.id;
			const staff = await Shop.findById(shopId)
				.select('staff').populate('staff.services');
			res.status(200).json(staff.staff);
		} catch (err) {
			next(err);
		}
	},
	async show( req, res, next ) {
		try {
			const { staffId } = req.query;
			const shopId = req.params.id;
			const shop = await Shop.findById(shopId, 'staff')
			const staff = shop.staff.find((staff) => {
				return staffId.toString() === staff._id.toString();
			})
			res.status(200).json(staff);
		} catch (err) {
			next(err);
		}
	},

}