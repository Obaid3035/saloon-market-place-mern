import Shop from "../../model/shop";
import cloudinary  from '../../utils/cloudinary';

module.exports = {
	async editMainImage(req, res, next) {
		try {
			const shopId = req.user.shop;
			const shop = await Shop.findOne({ _id: shopId }).select('shopImage');
			await cloudinary.v2.uploader.destroy(shop.shopImage.cloudinary_id, function(error,result) {
				console.log(result, error) });
			const shopImageResult = await cloudinary.v2.uploader.upload(req.file.path);
			await Shop.findByIdAndUpdate(shopId, {
				shopImage: {
					avatar: shopImageResult.secure_url,
					cloudinary_id: shopImageResult.public_id
				},
			})
			console.log(shopImageResult)
			res.status(200).json(shop)
		} catch (e) {
			console.log(e)
			next(e);
		}
	},
	async editBannerImage(req, res, next) {
		try {
			const shopId = req.user.shop;
			const shop = await Shop.findOne({ _id: shopId }).select('shopBannerImage');
			await cloudinary.v2.uploader.destroy(shop.shopBannerImage.cloudinary_id, function(error,result) {
				console.log(result, error) });
			const shopBannerResult = await cloudinary.v2.uploader.upload(req.file.path);
			await Shop.findByIdAndUpdate(shopId, {
				shopBannerImage: {
					avatar: shopBannerResult.secure_url,
					cloudinary_id: shopBannerResult.public_id
				},
			})
			console.log(shopBannerResult)
			res.status(200).json(shop)
		} catch (e) {
			console.log(e)
			next(e);
		}
	},

	async editGalleryImage(req, res, next) {
		try {

			const shopId = req.user.shop;
			const shop = await Shop.findOne({ _id: shopId }).select('gallery');
			const galleryResultPromise = req.files.map( (img) => {
				return cloudinary.v2.uploader.upload(img.path);
			})
			let imageResponses = await Promise.all(galleryResultPromise);
			console.log('hello')
			const galleryResult = imageResponses.map((img) => {
				return {
					avatar: img.secure_url,
					cloudinary_id: img.public_id
				}
			})
			await Shop.findByIdAndUpdate(shopId, {
				$push: {
					gallery: {
						$each: galleryResult
					}
				}
			},{upsert:true})
			res.status(200).json(shop)
		} catch (e) {
			console.log(e)
			next(e);
		}
	},

	async deleteGalleryImage(req, res, next) {
		try {
			const imgId = req.params.id;
			const { cloudinary_id} = req.body;
			console.log(imgId, cloudinary_id)
			const shop = await Shop.findById({ _id: req.user.shop });
			await cloudinary.v2.uploader.destroy(cloudinary_id, function(error,result) {
				console.log(result, error) });
			const gallery = shop.gallery;
			const galleryIndex = gallery.findIndex(gallery => {
				console.log(gallery._id, imgId);
				return gallery._id.toString() === imgId.toString()
			});

			console.log(galleryIndex);
			gallery.splice(galleryIndex, 1);

			await Shop.findOneAndUpdate({ _id: req.user.shop }, {
				gallery: gallery
			});
			res.status(200).json({delete: true})
		} catch (e) {
			next(e);
		}
	}
}