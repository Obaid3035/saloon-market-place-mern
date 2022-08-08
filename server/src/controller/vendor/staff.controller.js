import Shop from "../../model/shop";
import Service from "../../model/service";
import staff from "../../model/staff";
import Appointment from "../../model/appointment";
import fs from "fs";
import cloudinary from "../../utils/cloudinary";

module.exports = {

	async index(req, res, next) {
		try {
			const staff = await Shop.findById({ _id: req.user.shop })
				.select('staff').populate('staff.services');
			res.status(200).json(staff);
		} catch (err) {
			console.log(err)
			next(err)
		}
	},

	async create(req, res, next) {
		try {
			const staff = req.body;
			console.log(req.body)
			const Days = req.body.availabilityDays.split(',')
			req.body.availabilityDays = Days.map((day) => {
				return parseInt(day)
			});
			if (req.body.services.length > 0) {
				const staffIds = req.body.services.split(',');
				req.body.services = staffIds
			}
			console.log(req.file)


			const profilePicture = await cloudinary.v2.uploader.upload(req.file.path);

			staff.profilePicture = {
				avatar: profilePicture.secure_url,
				cloudinary_id: profilePicture.public_id
			}
			await Shop.updateOne({ _id: req.user.shop}, {
				$push: { staff }
			})
			res.status(201).json({ saved: true })
		} catch (err) {
			console.log(err)
			next(err);
		}
	},

	async update(req, res, next) {
		try {
			const staff = req.body;
			console.log(req.file)
			const Days = req.body.availabilityDays.split(',')
			req.body.availabilityDays = Days.map((day) => {
				return parseInt(day)
			});
			if (req.body.services.length > 0) {
				const staffIds = req.body.services.split(',');
				req.body.services = staffIds
			}

			staff.profilePicture = JSON.parse(req.body.currentPicture)
			console.log(staff)
			let profilePicture;
			if (req.file) {
				await cloudinary.v2.uploader.destroy(staff.profilePicture.cloudinary_id, function(error,result) {
					console.log(result, error) });
				profilePicture = await cloudinary.v2.uploader.upload(req.file.path);
				staff.profilePicture = {
					avatar: profilePicture.secure_url,
					cloudinary_id: profilePicture.public_id
				}
			}

			const staffId = req.params.id;
			const shop = await Shop.findById({ _id: req.user.shop });
			const staffs = shop.staff;
			const staffIndex = staffs.findIndex(staff => {
				console.log(staff._id, staffId);
				return staff._id.toString() === staffId.toString()
			});
			staffs[staffIndex] = staff;
			await Shop.findOneAndUpdate({ _id: req.user.shop }, {
				staff: staffs
			});
			res.status(200).json({ updated: true });
		} catch (err) {
			console.log(err)
			next(err);
		}
	},

	async delete(req, res, next) {
		try {
			const staffId = req.params.id;
			const shop = await Shop.findById({ _id: req.user.shop });
			const staffs = shop.staff;
			const staffIndex = staffs.findIndex(staff => {
				console.log(staff._id, staffId);
				return staff._id.toString() === staffId.toString()
			});
			console.log(staffIndex);
			staffs.splice(staffIndex, 1);
			await Appointment.deleteMany({staffId: staffId})
			await Shop.findOneAndUpdate({ _id: req.user.shop }, {
				staff: staffs
			});
			res.status(200).json({ deleted: true });
		} catch (err) {
			next(err);
		}
	},

	async getStaffServices( req, res, next ) {
		try {
			const shopId = req.user.shop;
			const shop = await Shop.findOne({_id: shopId}).select('services').populate('services', '_id serviceName');
			const selectFormattedServices = shop.services.map((service) => {
				return {
					value: service._id,
					label: service.serviceName,
				}
			})
			res.status(200).json(selectFormattedServices);
		} catch (err) {
			next(err)
		}
	},

	async getSingleStaff(req, res, next) {
		try {
			const shop = await Shop.findById(req.user.shop, 'staff');
			const staff = shop.staff.find((staff) => {
				return req.params.id.toString() === staff._id.toString();
			});
			res.status(200).json(staff);
		} catch (err) {
			next(err);
		}
	},

	async getStaff (req, res, next) {
		try {

			const shop = await Shop.findById(req.user.shop, 'staff');
			const selectFormattedStaff = shop.staff.map((staff) => {
				return {
					value: staff._id,
					label: staff.staffName,
				}
			})
			res.status(200).json(selectFormattedStaff)
		} catch (err) {
			next(err);
		}
	},
	async categoryOption( req, res, next ) {
		try {
			const shop = await Shop.findById(req.user.shop, 'categories');
			const selectFormattedCategory = shop.categories.map((category) => {
				return {
					value: category,
					label: category,
				}
			})
			res.status(200).json(selectFormattedCategory);
		} catch (err) {
			next(err);
		}
	},
	async addCategoryOption( req, res, next ) {
		try {
			console.log(req.body)
			await Shop.findByIdAndUpdate({ _id: req.user.shop}, {
				$push: {
					categories: req.body.categories
				}
			});
			res.status(200).json({updated: true});
		} catch (err) {
			next(err);
		}
	},

	async getStaffForEdit(req, res, next) {
		try {
			const shop = await Shop.findById(req.user.shop, 'staff').populate('staff.services');
			const staff = shop.staff.find((staff) => {
				return req.params.id.toString() === staff._id.toString();
			});
			res.status(200).json(staff);
		} catch (err) {
			next(err);
		}
	},
}