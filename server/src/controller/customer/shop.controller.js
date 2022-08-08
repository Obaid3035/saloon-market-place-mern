import Shop from "../../model/shop";

module.exports = {
	async index(req, res, next) {
		try {
			const { shopName, shopType, rating, lat, lng } = req.query
			let query = {}
			if (shopName) {
				query.shopName = { $regex: '.*' + shopName + '.*' };
			}
			if (shopType) {
				query.shopType =  shopType
			}
			if (rating) {
				query.avgRating = rating
			}

			console.log(req.query)

			if (parseInt(lat) === 0 && parseInt(lng) === 0 ) {
				const shops = await Shop.find({
					...query,
					$or: [
						{
							$and: [
								{
									shopStatus: 'ACTIVE',
								},
								{
									shopVisibility: true,
								}
							]
						},
						{
							$and: [
								{
									shopStatus: 'FEATURED',
								},
								{
									shopVisibility: true,
								}
							]
						}
					]
				}).select('shopName avgRating shopImage location address tags');
				res.status(200).json(shops);
			} else {
				const shops = await Shop.find({
					...query,
					location: {
						$near: {
							$maxDistance: 4000,
							$geometry: {
								type: "Point",
								coordinates: [lat, lng]
							}
						}
					},
					$or: [
						{
							$and: [
								{
									shopStatus: 'ACTIVE',
								},
								{
									shopVisibility: true,
								}
							]
						},
						{
							$and: [
								{
									shopStatus: 'FEATURED',
								},
								{
									shopVisibility: true,
								}
							]
						}
					]
				}).select('shopName avgRating shopImage location address tags');
				res.status(200).json(shops);
			}



		} catch (err) {
			console.log(err)
			next(err);
		}
	},
	async create(req, res, next) {
		try {
			await Shop.create(req.body);
			res.status(201).json({ saved: true });
		} catch (err) {
			next(err);
		}
	},

	async show(req, res, next) {
		try {
			const shopId = req.params.id;
			const shop = await Shop.findById(shopId)
				.populate('services');
			res.status(200).json(shop);
		} catch (err) {
			next(err)
		}
	},

	async getAllCategory(req, res, next) {
		try {
			const shopId = req.params.id;
			const shop = await Shop.findById({ _id: shopId })
				.select('categories');
			res.status(200).json(shop.categories);
		} catch (e) {
			next(e);
		}
	},

	async getService(req, res, next) {
		try {
			const shopId = req.params.id;
			const { category } = req.query
			let shop;
			shop = await Shop.findById(shopId).select('services').populate('services');
			if (category) {
				shop = await Shop.findById(shopId).select('services').populate({
					path: 'services',
					match: {
						category
					}
				});
			}
			res.status(200).json(shop);
		} catch (e) {
			console.log(e)
			next(e);
		}
	},

	async featuredShops(req, res, next) {
		try{
			const featuredShops = await Shop.find({
				shopStatus: 'FEATURED'
			}).select('shopName avgRating shopImage address tags');
			res.status(200).json(featuredShops);
		} catch (e) {
			next(e);
		}
	},

	async getShopName(req, res, next) {
		try {
			const shop = await Shop.findOne({
				_id: req.params.id
			}).select('shopName');
			res.status(200).json(shop);
		} catch (e) {
			next(e);
		}
	},
	async getAllBarberShop(req, res, next) {
		try {
			const shop = await Shop.find({
				shopType: 'Barbers',
				$or: [
					{
						$and: [
							{
								shopStatus: 'ACTIVE',
							},
							{
								shopVisibility: true,
							}
						]
					},
					{
						$and: [
							{
								shopStatus: 'FEATURED',
							},
							{
								shopVisibility: true,
							}
						]
					}
				]
			}).select('shopName avgRating shopImage address tags');
			res.status(200).json(shop)
		} catch (e) {
			next(e);
		}
	},
	async getAllBeauticianShop(req, res, next) {
		try {
			const shop = await Shop.find({
				shopType: 'Beautician',
				$or: [
					{
						$and: [
							{
								shopStatus: 'ACTIVE',
							},
							{
								shopVisibility: true,
							}
						]
					},
					{
						$and: [
							{
								shopStatus: 'FEATURED',
							},
							{
								shopVisibility: true,
							}
						]
					}
				]
			}).select('shopName avgRating shopImage address tags');
			res.status(200).json(shop)
		} catch (e) {
			next(e);
		}
	},

	async getAllDoctorShop(req, res, next) {
		try {
			const shop = await Shop.find({
				shopType: 'Aesthetic Doctor',
				$or: [
					{
						$and: [
							{
								shopStatus: 'ACTIVE',
							},
							{
								shopVisibility: true,
							}
						]
					},
					{
						$and: [
							{
								shopStatus: 'FEATURED',
							},
							{
								shopVisibility: true,
							}
						]
					}
				]
			}).select('shopName avgRating shopImage address tags');
			res.status(200).json(shop)
		} catch (e) {
			next(e);
		}
	},

	async getAllDentistShop(req, res, next) {
		try {
			const shop = await Shop.find({
				shopType: 'Smile Dentist',
				$or: [
					{
						$and: [
							{
								shopStatus: 'ACTIVE',
							},
							{
								shopVisibility: true,
							}
						]
					},
					{
						$and: [
							{
								shopStatus: 'FEATURED',
							},
							{
								shopVisibility: true,
							}
						]
					}
				]
			}).select('shopName avgRating shopImage address tags');
			res.status(200).json(shop)
		} catch (e) {
			next(e);
		}
	},

}
