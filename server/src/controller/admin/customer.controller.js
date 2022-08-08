import User from "../../model/user";

module.exports = {
	async index(req, res, next) {
		try {
			const customer = await User.find({
				role:{
					$in: 'CUSTOMER'
				}
			}).select('email phoneNumber')
			res.status(200).json(customer);
		} catch (e) {
			next(e);
		}
	}
}