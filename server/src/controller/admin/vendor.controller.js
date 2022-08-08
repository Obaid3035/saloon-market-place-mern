import User from "../../model/user";
import Shop from "../../model/shop";

module.exports = {
	async index(req, res, next) {
		try {
			const vendor = await User.find({
				role: {
					$in: 'VENDOR'
				}
			}).populate('shop', 'shopName shopType address shopStatus');
			const vendors = vendor.filter((user) => {
				if (user.shop) {
					return user
				}
			})
			res.status(200).json(vendors);
		} catch (e) {
			console.log(e)
			next(e);
		}
	},
	async getActiveVendors(req, res, next) {
		try {
			const vendor = await User.find({
				role: {
					$in: 'VENDOR'
				},
				shop: {
					$ne: null
				}
			}).where('shop').ne(null).select('email shop').populate({
				path: 'shop',
				select: 'shopName shopType address shopStatus',
				match: {
					shopStatus: 'ACTIVE',
				}
			});
			const vendors = vendor.filter((user) => {
				if (user.shop) {
					return user
				}
			})
			res.status(200).json(vendors);
		} catch (e) {
			next(e);
		}
	},
	async getInActiveVendors(req, res, next) {
		try {
			const vendor = await User.find({
				role: {
					$in: 'VENDOR'
				},
			}).where('shop').ne(null).select('email shop').populate({
				path: 'shop',
				select: 'shopName shopType address shopStatus',
				match: {
					shopStatus: 'INACTIVE',
				}
			});

			const vendors = vendor.filter((user) => {
				if (user.shop) {
					return user
				}
			})

			res.status(200).json(vendors);

		} catch (e) {
			next(e);
		}
	},

	async getBlockedVendors(req, res, next) {
		try {
			const vendor = await User.find({
				role: {
					$in: 'VENDOR'
				},
			}).where('shop').ne(null).select('email shop').populate({
				path: 'shop',
				select: 'shopName shopType address shopStatus',
				match: {
					shopStatus: 'BLOCKED',
				}
			});

			const vendors = vendor.filter((user) => {
				if (user.shop) {
					return user
				}
			})

			res.status(200).json(vendors);

		} catch (e) {
			next(e);
		}
	},

	async getFeaturedVendors(req, res, next) {
		try {
			const vendor = await User.find({
				role: {
					$in: 'VENDOR'
				},
			}).where('shop').ne(null).select('email shop').populate({
				path: 'shop',
				select: 'shopName shopType address shopStatus',
				match: {
					shopStatus: 'FEATURED',
				}
			});
			const vendors = vendor.filter((user) => {
				if (user.shop) {
					return user
				}
			})

			res.status(200).json(vendors);

		} catch (e) {
			next(e);
		}
	},

	async toActive(req, res, next) {
		try {
			const shopId = req.params.id;
			await Shop.findByIdAndUpdate(shopId, {
				shopStatus: 'ACTIVE'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},

	async toInActive(req, res, next) {
		try {
			const shopId = req.params.id;
			await Shop.findByIdAndUpdate(shopId, {
				shopStatus: 'INACTIVE'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},

	async toBlocked(req, res, next) {
		try {
			const shopId = req.params.id;
			await Shop.findByIdAndUpdate(shopId, {
				shopStatus: 'BLOCKED'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},

	async toFeatured(req, res, next) {
		try {
			const shopId = req.params.id;
			await Shop.findByIdAndUpdate(shopId, {
				shopStatus: 'FEATURED'
			})
			res.status(200).json({ updated: true });
		} catch (e) {
			next(e);
		}
	},
}