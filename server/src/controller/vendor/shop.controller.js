import Shop from "../../model/shop";
import fs from 'fs';
import User from "../../model/user";

import cloudinary  from '../../utils/cloudinary';


const getCurrentDay = (currentDay) => {
	if (currentDay === 1) {
		return 'monday';
	}
	if (currentDay === 2) {
		return 'tuesday';
	}
	if (currentDay === 3) {
		return 'wednesday';
	}
	if (currentDay === 4) {
		return 'thursday';
	}
	if (currentDay === 5) {
		return 'friday';
	}
	if (currentDay === 6) {
		return 'saturday';
	}
	if (currentDay === 7) {
		return 'sunday';
	}
}

module.exports = {
	async create( req, res, next ) {
		try {

			const shopImage = req.files.shopImage
			const shopBannerImage = req.files.shopBannerImage;
			const gallery = req.files.gallery;
			const shopImageResult = await cloudinary.v2.uploader.upload(shopImage[0].path);
			const shopBannerImageResult = await cloudinary.v2.uploader.upload(shopBannerImage[0].path);
			const galleryResultPromise = gallery.map( (img) => {
				return cloudinary.v2.uploader.upload(img.path);
			})
			let imageResponses = await Promise.all(galleryResultPromise);
			const galleryResult = imageResponses.map((img) => {
				return {
					avatar: img.secure_url,
					cloudinary_id: img.public_id
				}

			})
			const weekDays = JSON.parse(req.body.schedule);
			const schedule = {
				monday: weekDays.monday,
				tuesday: weekDays.tuesday,
				wednesday: weekDays.wednesday,
				thursday: weekDays.thursday,
				friday: weekDays.friday,
				saturday: weekDays.saturday,
				sunday: weekDays.sunday
			}

			let latlong = JSON.parse(req.body.location)

			const location = {
				coordinates: [latlong.lat, latlong.lng]
			}

			const shop = new Shop({
				shopName: req.body.shopName,
				location,
				shopType: req.body.shopType,
				address: req.body.address,
				description: req.body.description,
				schedule,
				shopImage: {
					avatar: shopImageResult.secure_url,
					cloudinary_id: shopImageResult.public_id
				},
				shopBannerImage: {
					avatar: shopBannerImageResult.secure_url,
					cloudinary_id: shopBannerImageResult.public_id
				},
				gallery: galleryResult
			})
			await shop.save();
			const user = await User.findById(req.user);
			user.profileSetup = true;
			user.shop = shop._id;
			await user.save();
			if (user.paymentId) {
				shop.shopStatus = 'ACTIVE'
				await shop.save();
			}
			res.status(200).json({ saved: true, profileSetup: true });
		} catch ( err ) {
			console.log('hello')
			console.log(err)
			next(err);
		}
	},
	async show( req, res, next ) {
		try {
			const shopId = req.user.shop;
			const shop = await Shop.findById(shopId);
			console.log(shopId)
			res.status(200).send(shop);
		} catch ( err ) {
			next(err);
		}
	},

	async edit( req, res, next ) {
		try {
			const weekDays = JSON.parse(req.body.schedule);
			const schedule = {
				monday: weekDays.monday,
				tuesday: weekDays.tuesday,
				wednesday: weekDays.wednesday,
				thursday: weekDays.thursday,
				friday: weekDays.friday,
				saturday: weekDays.saturday,
				sunday: weekDays.sunday
			}
			const shopId = req.user.shop;
			let latlong = JSON.parse(req.body.location)

			const location = {
				type: 'Point',
				coordinates: [latlong.lat, latlong.lng]
			}

			console.log('YOO',req.body.address)
			await Shop.findByIdAndUpdate({_id: shopId}, {
				shopName: req.body.shopName,
				location,
				address: req.body.address,
				description: req.body.description,
				shopVisibility: req.body.shopVisibility,
				schedule,
			});
			res.status(200).send({update: true});
		} catch ( err ) {
			console.log(err)
			next(err);
		}
	},
	async getAllImages(req, res, next) {
		try {
			const shopId = req.user.shop;
			const shop = await Shop.findById(shopId).select('shopImage shopBannerImage gallery');
			res.status(200).json(shop);
		} catch (e) {
			next(e);
		}
	},

	async getShopTiming(req, res, next) {
		try {
			const shopId = req.user.shop;
			const shop = await Shop.findById(shopId).select('schedule');

			let currentDay = new Date().getDay();
			let today = getCurrentDay(currentDay);
			console.log(today);
			const shopTiming = shop.schedule[today]
			console.log(shopTiming);
			res.status(200).json(shopTiming)
		} catch (e) {
			next(e);
		}
	}
}
