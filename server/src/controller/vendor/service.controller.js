import Service from "../../model/service";
import Shop from "../../model/shop";
module.exports = {

	async index(req, res, next) {
		try {
			const shop = await Shop.findOne({_id: req.user.shop}).select('services').populate('services')
			res.status(200).json(shop.services);
		} catch (err) {
			next(err);
		}
	},
	async create(req, res, next) {
		try {
			const service = await Service.create({
				serviceName: req.body.serviceName,
				price: req.body.price,
				duration: req.body.duration,
				description: req.body.description,
				category: req.body.category.value
			});
			await Shop.updateOne({ _id: req.user.shop}, {
				$push: { services: service._id}
			})
			res.status(201).json({ saved: true});
		} catch (err) {
			console.log(err);
			next(err)
		}
	},
	async update( req, res, next ) {
		try {
			console.log(req.body);
			const serviceId = req.params.id;
			await Service.findOneAndUpdate({ _id: serviceId }, {
				serviceName: req.body.serviceName,
				price: req.body.price,
				duration: parseInt(req.body.duration),
				description: req.body.description,
				category: req.body.category.value,
			});
			res.status(200).json({ updated: true });
		} catch (err) {
			console.log(err)
			next(err)
		}
	},
	async show( req, res, next ) {
		try {
			console.log(req.body);
			const serviceId = req.params.id;
			const service = await Service.findOne({ _id: serviceId });
			res.status(200).json(service);
		} catch (err) {
			console.log(err)
			next(err)
		}
	},
	async delete( req, res, next ) {
		try {
			const serviceId = req.params.id;
			const shop = await Shop.findById({ _id: req.user.shop });
			const services = shop.services;
			const serviceIndex = services.findIndex(service => {
				return service._id.toString() === serviceId.toString()
			});
			services.splice(serviceIndex, 1);
			console.log(serviceIndex);
			await Shop.findOneAndUpdate({ _id: req.user.shop }, {
				services: services
			});
			console.log(services);

			await Service.findByIdAndDelete(serviceId);

			res.status(200).json({ deleted: true })
		} catch (err) {
			next(err);
		}
	},

	async allCategories(req, res, next) {
		try {
			const shop = await Shop.findById({ _id: req.user.shop })
				.select('categories');
			res.status(200).json(shop.categories);
		} catch (e) {
			next(e);
		}
	},

	async deleteCategories(req, res, next) {
		try {
			const shop = await Shop.findById({ _id: req.user.shop })
			const categories = shop.categories;
			const staffIndex = categories.findIndex(category => {
				return category === req.body.category;
			});
			categories.splice(staffIndex, 1);

			console.log(categories)

			await Shop.findOneAndUpdate({ _id: req.user.shop }, {
				categories: categories
			});
			res.status(200).json({delete: true});
		} catch (e) {
			next(e);
		}
	}
}